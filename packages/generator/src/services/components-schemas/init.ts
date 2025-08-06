import { ComponentSchema, ComponentsSchemas, EntityId, isConditionSuccessful } from '@form-crafter/core'
import { isEmpty, isNotEmpty } from '@form-crafter/utils'
import { createEvent, Effect, EventCallable, sample, Store, StoreValue, StoreWritable } from 'effector'
import { cloneDeep, isEqual, merge, pick } from 'lodash-es'
import { combineEvents } from 'patronum'

import { SchemaService } from '../schema/types'
import { ThemeService } from '../theme'
import { ComponentsSchemasModel, extractComponentsSchemasModels } from './components-models'
import {
    CalcRelationRulesPayload,
    DepsComponentRuleSchemas,
    DepsRuleSchema,
    ReadyValidationsRules,
    ReadyValidationsRulesByRuleName,
    RulesOverridesCache,
} from './types'
import { buildExecutorContext } from './utils'

type RunRelationRulesPayload = {
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
    setReadyConditionalValidationRulesEvent: EventCallable<ReadyValidationsRules>
    setReadyConditionalValidationRulesByRuleNameEvent: EventCallable<ReadyValidationsRulesByRuleName>
    setReadyConditionalGroupValidationRulesEvent: EventCallable<ReadyValidationsRules[keyof ReadyValidationsRules]>
    setReadyConditionalGroupValidationRulesByRuleNameEvent: EventCallable<ReadyValidationsRulesByRuleName[keyof ReadyValidationsRulesByRuleName]>
    initComponentSchemasEvent: EventCallable<void>
    filterValidationErrorsEvent: EventCallable<Set<EntityId>>
    filterGroupsValidationErrorsEvent: EventCallable<Set<EntityId>>
    $hiddenComponents: StoreWritable<Set<EntityId>>
    $componentsSchemasModel: StoreWritable<ComponentsSchemasModel>
    $rulesOverridesCache: StoreWritable<RulesOverridesCache>
    $sortedAllRelationsDependents: Store<EntityId[]>
    $sortedRelationsDependentsByComponent: Store<Record<EntityId, EntityId[]>>
    $depsComponentRuleSchemas: Store<DepsComponentRuleSchemas>
    $depsGroupValidationRuleSchemas: Store<DepsRuleSchema>
    $readyConditionalValidationRules: Store<ReadyValidationsRules>
    $readyConditionalValidationRulesByRuleName: Store<ReadyValidationsRulesByRuleName>
    $readyConditionalValidationRulesIds: Store<ReadyValidationsRules[keyof ReadyValidationsRules]>
    $readyConditionalGroupValidationRules: Store<ReadyValidationsRules[keyof ReadyValidationsRules]>
    $readyConditionalGroupValidationRulesByRuleName: Store<ReadyValidationsRulesByRuleName[keyof ReadyValidationsRulesByRuleName]>
    $operatorsForConditions: ThemeService['$operatorsForConditions']
    $relationRules: ThemeService['$relationRules']
}

export const init = ({
    schemaService,
    runRelationRulesOnUserActionsEvent,
    setRulesOverridesCacheEvent,
    setHiddenComponentsEvent,
    setReadyConditionalValidationRulesEvent,
    setReadyConditionalValidationRulesByRuleNameEvent,
    setReadyConditionalGroupValidationRulesEvent,
    setReadyConditionalGroupValidationRulesByRuleNameEvent,
    initComponentSchemasEvent,
    filterValidationErrorsEvent,
    filterGroupsValidationErrorsEvent,
    updateComponentsSchemasModelFx,
    $hiddenComponents,
    $componentsSchemasModel,
    $rulesOverridesCache,
    $sortedAllRelationsDependents,
    $sortedRelationsDependentsByComponent,
    $depsComponentRuleSchemas,
    $depsGroupValidationRuleSchemas,
    $readyConditionalValidationRules,
    $readyConditionalValidationRulesByRuleName,
    $readyConditionalValidationRulesIds,
    $readyConditionalGroupValidationRules,
    $readyConditionalGroupValidationRulesByRuleName,
    $operatorsForConditions,
    $relationRules,
}: Params) => {
    const runRelationRulesEvent = createEvent<RunRelationRulesPayload>('runRelationRulesEvent')

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
            readyConditionalValidationRules: $readyConditionalValidationRules,
            readyConditionalValidationRulesByRuleName: $readyConditionalValidationRulesByRuleName,
            readyConditionalValidationRulesIds: $readyConditionalValidationRulesIds,
            readyConditionalGroupValidationRules: $readyConditionalGroupValidationRules,
            readyConditionalGroupValidationRulesByRuleName: $readyConditionalGroupValidationRulesByRuleName,
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
                readyConditionalValidationRules,
                readyConditionalValidationRulesByRuleName,
                readyConditionalValidationRulesIds,
                readyConditionalGroupValidationRules,
                readyConditionalGroupValidationRulesByRuleName,
            },
            { componentsSchemasToUpdate, skipIfValueUnchanged = true },
        ) => {
            const oldComponentsSchemas = extractComponentsSchemasModels(componentsSchemasModel)
            const newComponentsSchemas = merge(cloneDeep(oldComponentsSchemas), componentsSchemasToUpdate)

            const executorContext = buildExecutorContext({ componentsSchemas: newComponentsSchemas })

            const readyRules = cloneDeep(readyConditionalValidationRules)
            const readyRulesByRuleName = cloneDeep(readyConditionalValidationRulesByRuleName)

            const readyGroupRules = cloneDeep(readyConditionalGroupValidationRules)
            const readyGroupRulesByRuleName = cloneDeep(readyConditionalGroupValidationRulesByRuleName)

            const rulesToInactive: Set<EntityId> = new Set()

            const canBeContinueValidation = (componentId: EntityId, componentSchema: ComponentSchema) => {
                const oldValue = oldComponentsSchemas[componentId].properties.value
                const newValue = componentSchema.properties.value

                if (skipIfValueUnchanged && isEqual(oldValue, newValue)) {
                    return false
                }

                return true
            }

            const initReadyRules = (ownerComponentId: EntityId, ruleName: string) => {
                if (!(ownerComponentId in readyRules)) {
                    readyRules[ownerComponentId] = new Set()
                }

                if (!(ownerComponentId in readyRulesByRuleName)) {
                    readyRulesByRuleName[ownerComponentId] = {}
                }

                const currentReadyByRuleName = readyRulesByRuleName[ownerComponentId]
                if (!(ruleName in currentReadyByRuleName)) {
                    currentReadyByRuleName[ruleName] = new Set()
                }
            }

            const initReadyGroupRules = (ruleName: string) => {
                if (!(ruleName in readyGroupRulesByRuleName)) {
                    readyGroupRulesByRuleName[ruleName] = new Set()
                }
            }

            const calcReadyRules = (componentId: EntityId, componentSchema: ComponentSchema) => {
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

                    const isReadyRuleNow = readyConditionalValidationRulesIds.has(validationSchemaId)
                    if (!ruleIsReady && isReadyRuleNow) {
                        rulesToInactive.add(validationSchemaId)
                    }

                    initReadyRules(ownerComponentId, validationRuleSchema.ruleName)

                    if (ruleIsReady) {
                        readyRules[ownerComponentId].add(validationSchemaId)
                        readyRulesByRuleName[ownerComponentId][validationRuleSchema.ruleName].add(validationSchemaId)

                        evokedValidationsRules.add(validationSchemaId)
                    } else {
                        readyRules[ownerComponentId].delete(validationSchemaId)
                        readyRulesByRuleName[ownerComponentId][validationRuleSchema.ruleName].delete(validationSchemaId)
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

                    const isReadyRuleNow = readyConditionalGroupValidationRules.has(validationSchemaId)
                    if (!ruleIsReady && isReadyRuleNow) {
                        rulesToInactive.add(validationSchemaId)
                    }

                    initReadyGroupRules(validationRuleSchema.ruleName)

                    if (ruleIsReady) {
                        readyGroupRules.add(validationSchemaId)
                        readyGroupRulesByRuleName[validationRuleSchema.ruleName].add(validationSchemaId)

                        evokedValidationsRules.add(validationSchemaId)
                    } else {
                        readyGroupRules.delete(validationSchemaId)
                        readyGroupRulesByRuleName[validationRuleSchema.ruleName].delete(validationSchemaId)
                    }
                })
            }

            Object.entries(componentsSchemasToUpdate).forEach(([componentId, componentSchema]) => {
                calcReadyRules(componentId, componentSchema)
                calcReadyGroupRules(componentId, componentSchema)
            })

            return {
                readyRules,
                readyRulesByRuleName,
                readyGroupRules,
                readyGroupRulesByRuleName,
                rulesToInactive,
            }
        },
    })

    sample({
        clock: resultCalcOfReadyValidationRulesEvent,
        filter: ({ readyRules }) => isNotEmpty(readyRules),
        fn: ({ readyRules }) => readyRules,
        target: setReadyConditionalValidationRulesEvent,
    })

    sample({
        clock: resultCalcOfReadyValidationRulesEvent,
        filter: ({ readyRulesByRuleName }) => isNotEmpty(readyRulesByRuleName),
        fn: ({ readyRulesByRuleName }) => readyRulesByRuleName,
        target: setReadyConditionalValidationRulesByRuleNameEvent,
    })

    sample({
        clock: resultCalcOfReadyValidationRulesEvent,
        filter: ({ readyGroupRules }) => isNotEmpty(readyGroupRules),
        fn: ({ readyGroupRules }) => readyGroupRules,
        target: setReadyConditionalGroupValidationRulesEvent,
    })

    sample({
        clock: resultCalcOfReadyValidationRulesEvent,
        filter: ({ readyGroupRulesByRuleName }) => isNotEmpty(readyGroupRulesByRuleName),
        fn: ({ readyGroupRulesByRuleName }) => readyGroupRulesByRuleName,
        target: setReadyConditionalGroupValidationRulesByRuleNameEvent,
    })

    sample({
        clock: resultCalcOfReadyValidationRulesEvent,
        filter: ({ rulesToInactive }) => isNotEmpty(rulesToInactive),
        fn: ({ rulesToInactive }) => rulesToInactive,
        target: [filterValidationErrorsEvent, filterGroupsValidationErrorsEvent],
    })

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
