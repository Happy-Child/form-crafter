import { ComponentSchema, ComponentsSchemas, EntityId, isConditionSuccessful } from '@form-crafter/core'
import { isEmpty, isNotEmpty } from '@form-crafter/utils'
import { createEvent, Effect, EventCallable, sample, Store, StoreValue, StoreWritable } from 'effector'
import { cloneDeep, isEqual, merge, pick } from 'lodash-es'
import { combineEvents } from 'patronum'

import { SchemaMap } from '../../types'
import { extractComponentsSchemasModels } from '../../utils'
import { SchemaService } from '../schema/types'
import { ThemeService } from '../theme'
import { CalcRelationRulesPayload, DepsComponentRuleSchemas, DepsRuleSchema, ReadyValidationsRules, RulesOverridesCache } from './types'
import { buildExecutorContext } from './utils'

type RunrelationRulesPayload = {
    componentsSchemas: ComponentsSchemas
    newComponentsSchemas: ComponentsSchemas
    relationsDependents: EntityId[]
    componentsIdsToUpdate: EntityId[]
}

type CalcReadyConditionalValidationRulesPayload = {
    componentsSchemasToUpdate: ComponentsSchemas
    skipIfValueUnchanged?: boolean
}

type Params = {
    schemaService: SchemaService
    runRelationRulesOnUserActionsEvent: EventCallable<CalcRelationRulesPayload>
    setRulesOverridesCacheEvent: EventCallable<RulesOverridesCache>
    setHiddenComponentsEvent: EventCallable<Set<EntityId>>
    updateComponentsSchemasModelFx: Effect<ComponentsSchemas, void, Error>
    setReadyConditionalComponentsValidationRulesEvent: EventCallable<ReadyValidationsRules>
    setReadyConditionalGroupValidationRulesEvent: EventCallable<ReadyValidationsRules[keyof ReadyValidationsRules]>
    initComponentSchemasEvent: EventCallable<void>
    $hiddenComponents: StoreWritable<Set<EntityId>>
    $componentsSchemasModel: StoreWritable<SchemaMap>
    $rulesOverridesCache: StoreWritable<RulesOverridesCache>
    $sortedAllRelationsDependents: Store<EntityId[]>
    $sortedRelationsDependentsByComponent: Store<Record<EntityId, EntityId[]>>
    $depsComponentRuleSchemas: Store<DepsComponentRuleSchemas>
    $depsGroupValidationRuleSchemas: Store<DepsRuleSchema>
    $readyConditionalComponentsValidationRules: Store<ReadyValidationsRules>
    $readyConditionalGroupValidationRules: Store<ReadyValidationsRules[keyof ReadyValidationsRules]>
    $operatorsForConditions: ThemeService['$operatorsForConditions']
    $relationRules: ThemeService['$relationRules']
}

export const init = ({
    schemaService,
    runRelationRulesOnUserActionsEvent,
    setRulesOverridesCacheEvent,
    setHiddenComponentsEvent,
    setReadyConditionalComponentsValidationRulesEvent,
    setReadyConditionalGroupValidationRulesEvent,
    initComponentSchemasEvent,
    updateComponentsSchemasModelFx,
    $hiddenComponents,
    $componentsSchemasModel,
    $rulesOverridesCache,
    $sortedAllRelationsDependents,
    $sortedRelationsDependentsByComponent,
    $depsComponentRuleSchemas,
    $depsGroupValidationRuleSchemas,
    $readyConditionalComponentsValidationRules,
    $readyConditionalGroupValidationRules,
    $operatorsForConditions,
    $relationRules,
}: Params) => {
    const runRelationRulesEvent = createEvent<RunrelationRulesPayload>('runRelationRulesEvent')

    const calcReadyConditionalValidationRulesEvent = createEvent<CalcReadyConditionalValidationRulesPayload>('calcReadyConditionalValidationRulesEvent')

    sample({
        source: {
            componentsSchemasModel: $componentsSchemasModel,
        },
        clock: initComponentSchemasEvent,
        fn: ({ componentsSchemasModel }) => {
            const componentsSchemas = extractComponentsSchemasModels(componentsSchemasModel)
            return {
                componentsSchemasToUpdate: componentsSchemas,
                skipIfValueUnchanged: false,
            }
        },
        target: calcReadyConditionalValidationRulesEvent,
    })

    sample({
        source: {
            componentsSchemasModel: $componentsSchemasModel,
            sortedRelationsDependentsByComponent: $sortedRelationsDependentsByComponent,
        },
        clock: runRelationRulesOnUserActionsEvent,
        fn: ({ componentsSchemasModel, sortedRelationsDependentsByComponent }, { id: componentIdToUpdate, data: propertiesToUpdate }) => {
            const componentsSchemas = extractComponentsSchemasModels(componentsSchemasModel)

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
        target: runRelationRulesEvent,
    })

    const resultOfRunrelationRulesEvent = sample({
        source: {
            initialComponentsSchemas: schemaService.$initialComponentsSchemas,
            rulesOverridesCache: $rulesOverridesCache,
            depsComponentRuleSchemas: $depsComponentRuleSchemas,
            operatorsForConditions: $operatorsForConditions,
            relationRules: $relationRules,
            hiddenComponents: $hiddenComponents,
        },
        clock: runRelationRulesEvent,
        fn: (
            { initialComponentsSchemas, rulesOverridesCache, depsComponentRuleSchemas, operatorsForConditions, relationRules, hiddenComponents },
            { componentsSchemas, newComponentsSchemas, componentsIdsToUpdate, relationsDependents },
        ) => {
            const componentsIdsToUpdates: Set<EntityId> = new Set(componentsIdsToUpdate)

            const newRulesOverridesCache = cloneDeep(rulesOverridesCache)
            newComponentsSchemas = cloneDeep(newComponentsSchemas)

            const executorContext = buildExecutorContext({ componentsSchemas: newComponentsSchemas })

            const runCalcRules = (componentId: EntityId) => {
                const componentModel = newComponentsSchemas[componentId]
                const relations = componentModel.relations

                const iterationsrelationRulesAppliedCache: StoreValue<typeof $rulesOverridesCache> = {}

                relations?.schemas?.forEach(({ id: ruleId, ruleName, options, condition }) => {
                    if (isEmpty(condition)) {
                        return
                    }

                    const canBeApply = isConditionSuccessful({ ctx: executorContext, condition, operators: operatorsForConditions })
                    const isActiveRule = ruleId in newRulesOverridesCache

                    if (canBeApply) {
                        const rule = relationRules[ruleName]
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
                        iterationsrelationRulesAppliedCache[ruleId] = newProperties
                    } else if (isActiveRule) {
                        const ruleLatestAppliedKeysCache = Object.keys(newRulesOverridesCache[ruleId] || {})

                        let iterationsUpdatedKeysProperties = Object.entries(iterationsrelationRulesAppliedCache).reduce<string[]>(
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
                const dependents = depsComponentRuleSchemas.relations.schemaIdToDependents[depComponentId]
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
        clock: resultOfRunrelationRulesEvent,
        fn: ({ componentsSchemasToUpdate }) => ({
            componentsSchemasToUpdate,
        }),
        target: calcReadyConditionalValidationRulesEvent,
    })

    const resultCalcOfReadyValidationRulesEvent = sample({
        source: {
            validationRuleSchemas: schemaService.$componentsValidationSchemas,
            groupValidationSchemas: schemaService.$groupValidationSchemas,
            depsComponentRuleSchemas: $depsComponentRuleSchemas,
            depsGroupValidationRuleSchemas: $depsGroupValidationRuleSchemas,
            componentsSchemasModel: $componentsSchemasModel,
            operatorsForConditions: $operatorsForConditions,
            readyConditionalComponentsValidationRules: $readyConditionalComponentsValidationRules,
            readyConditionalGroupValidationRules: $readyConditionalGroupValidationRules,
        },
        clock: calcReadyConditionalValidationRulesEvent,
        fn: (
            {
                validationRuleSchemas,
                groupValidationSchemas,
                depsComponentRuleSchemas,
                depsGroupValidationRuleSchemas,
                componentsSchemasModel,
                operatorsForConditions,
                readyConditionalComponentsValidationRules,
                readyConditionalGroupValidationRules,
            },
            { componentsSchemasToUpdate, skipIfValueUnchanged = true },
        ) => {
            const oldComponentsSchemas = extractComponentsSchemasModels(componentsSchemasModel)
            const newComponentsSchemas = merge(cloneDeep(oldComponentsSchemas), componentsSchemasToUpdate)

            const executorContext = buildExecutorContext({ componentsSchemas: newComponentsSchemas })

            // Calc of ready components validation rules
            const readyComponentsRules = cloneDeep(readyConditionalComponentsValidationRules)
            const readyGroupRules = cloneDeep(readyConditionalGroupValidationRules)

            const canBeContinueValidation = (componentId: EntityId, componentSchema: ComponentSchema) => {
                const oldValue = oldComponentsSchemas[componentId].properties.value
                const newValue = componentSchema.properties.value

                if (skipIfValueUnchanged && isEqual(oldValue, newValue)) {
                    return false
                }

                return true
            }

            const getAndInitReadyComponentsRules = (ownerComponentId: EntityId, ruleName: string) => {
                // TODO НАХУЯ ЭТА ХУЕТА!!! И нужна ли в form rules init
                readyComponentsRules[ownerComponentId] = {
                    readyBySchemaId: new Set(),
                    readyGroupedByRuleName: {},
                }
                //

                const currentReadyByComponent = readyComponentsRules[ownerComponentId]
                if (!(ruleName in currentReadyByComponent.readyGroupedByRuleName)) {
                    currentReadyByComponent.readyGroupedByRuleName[ruleName] = new Set()
                }

                return {
                    readyBySchemaId: currentReadyByComponent.readyBySchemaId,
                    readyGroupedByRuleName: currentReadyByComponent.readyGroupedByRuleName[ruleName],
                }
            }

            const getAndInitReadyGroupRules = (ruleName: string) => {
                if (!(ruleName in readyGroupRules.readyGroupedByRuleName)) {
                    readyGroupRules.readyGroupedByRuleName[ruleName] = new Set()
                }

                return {
                    readyBySchemaId: readyGroupRules.readyBySchemaId,
                    readyGroupedByRuleName: readyGroupRules.readyGroupedByRuleName[ruleName],
                }
            }

            const calcReadyComponentsRules = (componentId: EntityId, componentSchema: ComponentSchema) => {
                const canBeContinue = canBeContinueValidation(componentId, componentSchema)
                if (!canBeContinue) {
                    return
                }

                const dependentsValidations = depsComponentRuleSchemas.validations.schemaIdToDependents[componentId]
                if (!isNotEmpty(dependentsValidations)) {
                    return
                }

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

                    const { readyBySchemaId, readyGroupedByRuleName } = getAndInitReadyComponentsRules(ownerComponentId, validationRuleSchema.ruleName)

                    if (ruleIsReady) {
                        readyBySchemaId.add(validationSchemaId)
                        readyGroupedByRuleName.add(validationSchemaId)

                        evokedValidationsRules.add(validationSchemaId)
                    } else {
                        readyBySchemaId.delete(validationSchemaId)
                        readyGroupedByRuleName.delete(validationSchemaId)
                    }
                })
            }

            const calcReadyGroupRules = (componentId: EntityId, componentSchema: ComponentSchema) => {
                const canBeContinue = canBeContinueValidation(componentId, componentSchema)
                if (!canBeContinue) {
                    return
                }

                const dependentsValidations = depsGroupValidationRuleSchemas.schemaIdToDependents[componentId]
                if (!isNotEmpty(dependentsValidations)) {
                    return
                }

                const evokedValidationsRules: Set<EntityId> = new Set()

                dependentsValidations.forEach((validationSchemaId) => {
                    if (evokedValidationsRules.has(validationSchemaId)) {
                        return
                    }

                    const validationRuleSchema = groupValidationSchemas[validationSchemaId]

                    const ruleIsReady = isConditionSuccessful({
                        ctx: executorContext,
                        condition: validationRuleSchema.condition!,
                        operators: operatorsForConditions,
                    })

                    const { readyBySchemaId, readyGroupedByRuleName } = getAndInitReadyGroupRules(validationRuleSchema.ruleName)

                    if (ruleIsReady) {
                        readyBySchemaId.add(validationSchemaId)
                        readyGroupedByRuleName.add(validationSchemaId)

                        evokedValidationsRules.add(validationSchemaId)
                    } else {
                        readyBySchemaId.delete(validationSchemaId)
                        readyGroupedByRuleName.delete(validationSchemaId)
                    }
                })
            }

            Object.entries(componentsSchemasToUpdate).forEach(([componentId, componentSchema]) => {
                calcReadyComponentsRules(componentId, componentSchema)
                calcReadyGroupRules(componentId, componentSchema)
            })

            return { readyComponentsRules, readyGroupRules }
        },
    })

    sample({
        clock: resultCalcOfReadyValidationRulesEvent,
        fn: ({ readyComponentsRules }) => readyComponentsRules,
        target: setReadyConditionalComponentsValidationRulesEvent,
    })

    sample({
        clock: resultCalcOfReadyValidationRulesEvent,
        fn: ({ readyGroupRules }) => readyGroupRules,
        target: setReadyConditionalGroupValidationRulesEvent,
    })

    // RESET VALIDATIONS ERRORS, COMPONENTS AND GROUPS

    sample({
        source: {
            componentsSchemasModel: $componentsSchemasModel,
            sortedAllRelationsDependents: $sortedAllRelationsDependents,
        },
        clock: combineEvents([initComponentSchemasEvent, resultCalcOfReadyValidationRulesEvent]),
        fn: ({ componentsSchemasModel, sortedAllRelationsDependents }) => {
            const componentsSchemas = extractComponentsSchemasModels(componentsSchemasModel)

            return {
                componentsSchemas,
                newComponentsSchemas: componentsSchemas,
                componentsIdsToUpdate: [],
                relationsDependents: sortedAllRelationsDependents,
            }
        },
        target: runRelationRulesEvent,
    })

    sample({
        clock: resultOfRunrelationRulesEvent,
        fn: ({ componentsSchemasToUpdate }) => componentsSchemasToUpdate,
        target: updateComponentsSchemasModelFx,
    })

    sample({
        clock: resultOfRunrelationRulesEvent,
        fn: ({ rulesOverridesCacheToUpdate }) => rulesOverridesCacheToUpdate,
        target: setRulesOverridesCacheEvent,
    })

    sample({
        clock: resultOfRunrelationRulesEvent,
        fn: ({ hiddenComponents }) => hiddenComponents,
        target: setHiddenComponentsEvent,
    })
}
