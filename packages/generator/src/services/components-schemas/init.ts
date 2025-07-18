import { ComponentSchema, ComponentsSchemas, EntityId, isConditionSuccessful } from '@form-crafter/core'
import { isEmpty, isNotEmpty } from '@form-crafter/utils'
import { createEvent, Effect, EventCallable, sample, Store, StoreValue, StoreWritable } from 'effector'
import { cloneDeep, isEqual, merge, pick } from 'lodash-es'
import { combineEvents } from 'patronum'

import { SchemaMap } from '../../types'
import { getComponentsSchemasFromModels } from '../../utils'
import { ThemeService } from '../theme'
import { CalcRelationsRulesPayload, ReadyConditionalValidationsRules, RulesDepsFromSchema, RulesOverridesCache, ValidationRuleSchemas } from './types'
import { buildExecutorContext } from './utils'

const a = { a: { test: 1, props: { value: '2', disabled: true, visability: true } } }
const b = { a: { props: { value: '2234', disabled: false, conditionas: [3, 4, 5] } } }

console.log('merge: ', merge(a, b))

type RunRelationsRulesPayload = {
    componentsSchemas: ComponentsSchemas
    newComponentsSchemas: ComponentsSchemas
    relationsDependents: EntityId[]
    componentsIdsToUpdate: EntityId[]
}

type CalcReadyConditionalValidationsRulesPayload = {
    componentsSchemasToUpdate: ComponentsSchemas
    skipIfValueUnchanged?: boolean
}

type Params = {
    runRelationsRulesOnUserActionsEvent: EventCallable<CalcRelationsRulesPayload>
    setRulesOverridesCacheEvent: EventCallable<RulesOverridesCache>
    setHiddenComponentsEvent: EventCallable<Set<EntityId>>
    updateComponentsSchemasModelFx: Effect<ComponentsSchemas, SchemaMap, Error>
    setReadyConditionalValidationsRulesEvent: EventCallable<ReadyConditionalValidationsRules>
    initComponentSchemasEvent: EventCallable<void>
    $hiddenComponents: StoreWritable<Set<EntityId>>
    $initialComponentsSchemas: StoreWritable<ComponentsSchemas>
    $componentsSchemasModel: StoreWritable<SchemaMap>
    $rulesOverridesCache: StoreWritable<RulesOverridesCache>
    $sortedRelationsDependents: Store<EntityId[]>
    $sortedRelationsDependentsByComponent: Store<Record<EntityId, EntityId[]>>
    $rulesDepsFromSchema: Store<RulesDepsFromSchema>
    $validationRuleSchemas: Store<ValidationRuleSchemas>
    $readyConditionalValidationsRules: Store<ReadyConditionalValidationsRules>
    $operatorsForConditions: ThemeService['$operatorsForConditions']
    $relationsRules: ThemeService['$relationsRules']
}

export const init = ({
    runRelationsRulesOnUserActionsEvent,
    setRulesOverridesCacheEvent,
    setHiddenComponentsEvent,
    setReadyConditionalValidationsRulesEvent,
    initComponentSchemasEvent,
    updateComponentsSchemasModelFx,
    $hiddenComponents,
    $initialComponentsSchemas,
    $componentsSchemasModel,
    $rulesOverridesCache,
    $sortedRelationsDependents,
    $sortedRelationsDependentsByComponent,
    $rulesDepsFromSchema,
    $validationRuleSchemas,
    $operatorsForConditions,
    $relationsRules,
    $readyConditionalValidationsRules,
}: Params) => {
    const runRelationsRulesEvent = createEvent<RunRelationsRulesPayload>('runRelationsRulesEvent')

    const calcReadyConditionalValidationsRulesEvent = createEvent<CalcReadyConditionalValidationsRulesPayload>('calcReadyConditionalValidationsRulesEvent')

    sample({
        source: {
            componentsSchemasModel: $componentsSchemasModel,
            sortedRelationsDependents: $sortedRelationsDependents,
        },
        clock: initComponentSchemasEvent,
        fn: ({ componentsSchemasModel }) => {
            const componentsSchemas = getComponentsSchemasFromModels(componentsSchemasModel)
            return {
                componentsSchemasToUpdate: componentsSchemas,
                skipIfValueUnchanged: false,
            }
        },
        target: calcReadyConditionalValidationsRulesEvent,
    })

    sample({
        source: {
            componentsSchemasModel: $componentsSchemasModel,
            sortedRelationsDependentsByComponent: $sortedRelationsDependentsByComponent,
        },
        clock: runRelationsRulesOnUserActionsEvent,
        fn: ({ componentsSchemasModel, sortedRelationsDependentsByComponent }, { id: componentIdToUpdate, data: propertiesToUpdate }) => {
            const componentsSchemas = getComponentsSchemasFromModels(componentsSchemasModel)

            const finalComponentsSchemas = cloneDeep(componentsSchemas)
            finalComponentsSchemas[componentIdToUpdate].properties = {
                ...finalComponentsSchemas[componentIdToUpdate].properties,
                ...propertiesToUpdate,
            }

            const relationsDependents = sortedRelationsDependentsByComponent[componentIdToUpdate] || []

            return {
                componentsSchemas,
                newComponentsSchemas: finalComponentsSchemas,
                componentsIdsToUpdate: [componentIdToUpdate],
                relationsDependents,
            }
        },
        target: runRelationsRulesEvent,
    })

    const resultOfRunRelationsRulesEvent = sample({
        source: {
            initialComponentsSchemas: $initialComponentsSchemas,
            rulesOverridesCache: $rulesOverridesCache,
            rulesDepsFromSchema: $rulesDepsFromSchema,
            operatorsForConditions: $operatorsForConditions,
            relationsRules: $relationsRules,
            hiddenComponents: $hiddenComponents,
        },
        clock: runRelationsRulesEvent,
        fn: (
            { initialComponentsSchemas, rulesOverridesCache, rulesDepsFromSchema, operatorsForConditions, relationsRules, hiddenComponents },
            { componentsSchemas, newComponentsSchemas, componentsIdsToUpdate, relationsDependents },
        ) => {
            const componentsIdsToUpdates: Set<EntityId> = new Set(componentsIdsToUpdate)

            const newRulesOverridesCache = cloneDeep(rulesOverridesCache)
            newComponentsSchemas = cloneDeep(newComponentsSchemas)

            const executorContext = buildExecutorContext({ componentsSchemas: newComponentsSchemas })

            const runCalcRules = (componentId: EntityId) => {
                const componentModel = newComponentsSchemas[componentId]
                const relationsRulesSchema = componentModel.relations

                const iterationsRelationsRulesAppliedCache: StoreValue<typeof $rulesOverridesCache> = {}

                relationsRulesSchema?.options?.forEach(({ id: ruleId, ruleName, options, condition }) => {
                    if (isEmpty(condition)) {
                        return
                    }

                    const canBeApply = isConditionSuccessful({ ctx: executorContext, condition, operators: operatorsForConditions })
                    const isActiveRule = ruleId in newRulesOverridesCache

                    if (canBeApply) {
                        const rule = relationsRules[ruleName]
                        const newProperties = rule.execute(componentModel, { options: options || {}, ctx: executorContext })

                        if (!isNotEmpty(newProperties)) {
                            return
                        }

                        const isNewProperties = Object.entries(newProperties).some(([key, value]) => !isEqual(value, newRulesOverridesCache[ruleId]?.[key]))
                        if (isNewProperties) {
                            componentsIdsToUpdates.add(componentId)
                        }

                        newComponentsSchemas[componentId] = {
                            ...newComponentsSchemas[componentId],
                            properties: {
                                ...newComponentsSchemas[componentId].properties,
                                ...newProperties,
                            },
                        } as ComponentSchema

                        newRulesOverridesCache[ruleId] = { ...newRulesOverridesCache[ruleId], ...newProperties }
                        iterationsRelationsRulesAppliedCache[ruleId] = newProperties
                    } else if (isActiveRule) {
                        const ruleLatestAppliedKeysCache = Object.keys(newRulesOverridesCache[ruleId] || {})

                        let iterationsUpdatedKeysProperties = Object.entries(iterationsRelationsRulesAppliedCache).reduce<string[]>(
                            (arr, [, appliedComponentProperties]) => {
                                if (isNotEmpty(appliedComponentProperties)) {
                                    return [...arr, ...Object.keys(appliedComponentProperties)]
                                }
                                return arr
                            },
                            [],
                        )
                        iterationsUpdatedKeysProperties = Array.from(new Set(iterationsUpdatedKeysProperties))

                        const propertiesKeysToRollback = ruleLatestAppliedKeysCache.filter((key) => !iterationsUpdatedKeysProperties.includes(key))

                        const propertiesToRollback = pick(initialComponentsSchemas[componentId].properties, propertiesKeysToRollback)

                        newComponentsSchemas[componentId] = {
                            ...newComponentsSchemas[componentId],
                            properties: {
                                ...newComponentsSchemas[componentId].properties,
                                ...propertiesToRollback,
                            },
                        } as ComponentSchema

                        delete newRulesOverridesCache[ruleId]

                        componentsIdsToUpdates.add(componentId)
                    }
                })
            }

            const finalHiddenComponents: Set<EntityId> = new Set(hiddenComponents)
            relationsDependents.forEach((depComponentId) => {
                // 1.1 Проверить есть ли не скрытые зависимости. Если есть - идём дальше. Если нет - выход.
                // 1.2 Так же идём дальше если нет зависимостей вообще.
                const dependents = rulesDepsFromSchema.relations.entityIdToDependents[depComponentId]
                const existsVisibleDep = isNotEmpty(dependents) ? dependents.some((componentId) => !finalHiddenComponents.has(componentId)) : true
                if (!existsVisibleDep) {
                    return
                }

                // 2. Если нет visability.condition выполняем runCalcRules и выходим
                const visabilityCondition = newComponentsSchemas[depComponentId]?.visability?.condition
                if (isEmpty(visabilityCondition)) {
                    runCalcRules(depComponentId)
                    return
                }

                // 3. Если статус видимости не изменился то, если компонент не скрыт вызываем runCalcRules, иначе возврат
                const shouldBeHidden = isConditionSuccessful({ ctx: executorContext, condition: visabilityCondition, operators: operatorsForConditions })
                const componentIsHiddenNow = !!newComponentsSchemas[depComponentId].visability?.hidden
                const isNewVisabilityStatus = componentIsHiddenNow !== shouldBeHidden
                if (!isNewVisabilityStatus) {
                    if (!componentIsHiddenNow) {
                        runCalcRules(depComponentId)
                    }
                    return
                }

                // 4. Если статус видимости меняется с visible на hidden - делаем одно, иначе другое
                const newComponentSchema = {
                    ...newComponentsSchemas[depComponentId],
                    visability: {
                        ...newComponentsSchemas[depComponentId].visability,
                    },
                }
                const isVisibleToHidden = newComponentsSchemas[depComponentId].visability?.hidden !== true && shouldBeHidden
                if (isVisibleToHidden) {
                    finalHiddenComponents.add(depComponentId)

                    newComponentSchema.visability.hidden = true
                    newComponentsSchemas[depComponentId] = newComponentSchema

                    componentsIdsToUpdates.add(depComponentId)
                } else {
                    finalHiddenComponents.delete(depComponentId)

                    newComponentSchema.visability.hidden = false
                    newComponentsSchemas[depComponentId] = newComponentSchema

                    componentsIdsToUpdates.add(depComponentId)

                    runCalcRules(depComponentId)
                }
            })

            // TODO change to array
            const componentsSchemasToUpdate = Array.from(componentsIdsToUpdates)
                .filter((componentId) => {
                    const isEqualProperties = isEqual(componentsSchemas[componentId].properties, newComponentsSchemas[componentId].properties)
                    const isEqualHidden = !!componentsSchemas[componentId].visability?.hidden === !!newComponentsSchemas[componentId].visability?.hidden

                    return !isEqualProperties || !isEqualHidden
                })
                .reduce<ComponentsSchemas>((obj, componentId) => ({ ...obj, [componentId]: newComponentsSchemas[componentId] }), {})

            return { componentsSchemasToUpdate, rulesOverridesCacheToUpdate: newRulesOverridesCache, hiddenComponents: finalHiddenComponents }
        },
    })

    sample({
        clock: resultOfRunRelationsRulesEvent,
        fn: ({ componentsSchemasToUpdate, hiddenComponents }) => {
            const preparedSchema = Object.fromEntries(Object.entries(componentsSchemasToUpdate).filter(([componentId]) => !hiddenComponents.has(componentId)))

            return {
                componentsSchemasToUpdate: preparedSchema,
            }
        },
        target: calcReadyConditionalValidationsRulesEvent,
    })

    const resultOfCalcReadyValidationsRulesEvent = sample({
        source: {
            validationRuleSchemas: $validationRuleSchemas,
            rulesDepsFromSchema: $rulesDepsFromSchema,
            componentsSchemasModel: $componentsSchemasModel,
            operatorsForConditions: $operatorsForConditions,
            readyConditionalValidationsRules: $readyConditionalValidationsRules,
        },
        clock: calcReadyConditionalValidationsRulesEvent,
        fn: (
            { validationRuleSchemas, rulesDepsFromSchema, componentsSchemasModel, operatorsForConditions, readyConditionalValidationsRules },
            { componentsSchemasToUpdate, skipIfValueUnchanged = true },
        ) => {
            const oldComponentsSchemas = getComponentsSchemasFromModels(componentsSchemasModel)
            const newComponentsSchemas = merge(cloneDeep(oldComponentsSchemas), componentsSchemasToUpdate)

            const validationSchemaIdToDependents = rulesDepsFromSchema.validations.entityIdToDependents

            const readyRules = cloneDeep(readyConditionalValidationsRules)

            const getOrInitReadyRules = (ownerComponentId: EntityId, ruleName: string) => {
                if (!(ownerComponentId in readyRules)) {
                    readyRules[ownerComponentId] = {
                        readyBySchemaId: new Set(),
                        readyGroupedByRuleName: {},
                    }
                }

                const readyByComponent = readyRules[ownerComponentId]
                if (!(ruleName in readyByComponent.readyGroupedByRuleName)) {
                    readyByComponent.readyGroupedByRuleName[ruleName] = new Set()
                }

                return {
                    readyBySchemaId: readyByComponent.readyBySchemaId,
                    readyGroupedByRuleName: readyByComponent.readyGroupedByRuleName[ruleName],
                }
            }

            Object.entries(componentsSchemasToUpdate).forEach(([componentId, componentSchema]) => {
                const oldValue = oldComponentsSchemas[componentId].properties.value
                const newValue = componentSchema.properties.value

                // TODO Если uploader компонент и в value объект - что делать? Сравнить файлы как объекты не получиться
                if (skipIfValueUnchanged && isEqual(oldValue, newValue)) {
                    return
                }

                const dependentsValidations = validationSchemaIdToDependents[componentId]
                if (!isNotEmpty(dependentsValidations)) {
                    return
                }

                const executorContext = buildExecutorContext({ componentsSchemas: newComponentsSchemas })
                const evokedValidationsRules: Set<EntityId> = new Set()

                dependentsValidations.forEach((validationSchemaId) => {
                    if (evokedValidationsRules.has(validationSchemaId)) {
                        return
                    }

                    const { ownerComponentId, schema: validationRuleSchema } = validationRuleSchemas[validationSchemaId]
                    const ruleIsReady = isConditionSuccessful({
                        ctx: executorContext,
                        condition: validationRuleSchema.condition!,
                        operators: operatorsForConditions,
                    })

                    const { readyBySchemaId, readyGroupedByRuleName } = getOrInitReadyRules(ownerComponentId, validationRuleSchema.ruleName)

                    if (ruleIsReady) {
                        readyBySchemaId.add(validationSchemaId)
                        readyGroupedByRuleName.add(validationSchemaId)

                        evokedValidationsRules.add(validationSchemaId)
                    } else {
                        readyBySchemaId.delete(validationSchemaId)
                        readyGroupedByRuleName.delete(validationSchemaId)
                    }
                })
            })

            return readyRules
        },
    })

    sample({
        clock: resultOfCalcReadyValidationsRulesEvent,
        target: setReadyConditionalValidationsRulesEvent,
    })

    sample({
        source: {
            componentsSchemasModel: $componentsSchemasModel,
            sortedRelationsDependents: $sortedRelationsDependents,
        },
        clock: combineEvents([initComponentSchemasEvent, resultOfCalcReadyValidationsRulesEvent]),
        fn: ({ componentsSchemasModel, sortedRelationsDependents }) => {
            const componentsSchemas = getComponentsSchemasFromModels(componentsSchemasModel)

            return {
                componentsSchemas,
                newComponentsSchemas: componentsSchemas,
                componentsIdsToUpdate: [],
                relationsDependents: sortedRelationsDependents,
            }
        },
        target: runRelationsRulesEvent,
    })

    sample({
        clock: resultOfRunRelationsRulesEvent,
        fn: ({ componentsSchemasToUpdate }) => componentsSchemasToUpdate,
        target: updateComponentsSchemasModelFx,
    })

    sample({
        clock: resultOfRunRelationsRulesEvent,
        fn: ({ rulesOverridesCacheToUpdate }) => rulesOverridesCacheToUpdate,
        target: setRulesOverridesCacheEvent,
    })

    sample({
        clock: resultOfRunRelationsRulesEvent,
        fn: ({ hiddenComponents }) => hiddenComponents,
        target: setHiddenComponentsEvent,
    })
}
