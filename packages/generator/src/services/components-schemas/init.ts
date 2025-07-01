import { ComponentSchema, ComponentsSchemas, EntityId, isConditionSuccessful, RuleExecutorContext } from '@form-crafter/core'
import { isEmpty, isNotEmpty } from '@form-crafter/utils'
import { Effect, EventCallable, sample, Store, StoreValue, StoreWritable } from 'effector'
import { cloneDeep, isEqual, pick } from 'lodash-es'

import { SchemaMap } from '../../types'
import { ThemeService } from '../theme'
import { CalcRelationsRulesPayload, ComponentsDepsFromSchemaStore, RulesOverridesCacheStore } from './types'

type Params = {
    calcRelationsRulesEvent: EventCallable<CalcRelationsRulesPayload>
    setRulesOverridesCacheEvent: EventCallable<RulesOverridesCacheStore>
    setHiddenComponentsEvent: EventCallable<Set<EntityId>>
    updateComponentsSchemasModelFx: Effect<ComponentsSchemas, SchemaMap, Error>
    $hiddenComponents: StoreWritable<Set<EntityId>>
    $initialComponentsSchemas: StoreWritable<ComponentsSchemas>
    $componentsSchemasModel: StoreWritable<SchemaMap>
    $rulesOverridesCache: StoreWritable<RulesOverridesCacheStore>
    $depsResolutionOrder: Store<Record<EntityId, EntityId[]>>
    $componentsDepsFromSchema: Store<ComponentsDepsFromSchemaStore>
    $operatorsForConditions: ThemeService['$operatorsForConditions']
    $relationsRulesMap: ThemeService['$relationsRulesMap']
}

export const init = ({
    calcRelationsRulesEvent,
    setRulesOverridesCacheEvent,
    setHiddenComponentsEvent,
    updateComponentsSchemasModelFx,
    $hiddenComponents,
    $initialComponentsSchemas,
    $componentsSchemasModel,
    $rulesOverridesCache,
    $depsResolutionOrder,
    $componentsDepsFromSchema,
    $operatorsForConditions,
    $relationsRulesMap,
}: Params) => {
    const executeRelationsRulesEvent = sample({
        source: {
            initialComponentsSchemas: $initialComponentsSchemas,
            componentsSchemasModel: $componentsSchemasModel,
            rulesOverridesCache: $rulesOverridesCache,
            depsResolutionOrder: $depsResolutionOrder,
            componentsDepsFromSchema: $componentsDepsFromSchema,
            operatorsForConditions: $operatorsForConditions,
            relationsRulesMap: $relationsRulesMap,
            hiddenComponents: $hiddenComponents,
        },
        clock: calcRelationsRulesEvent,
        fn: (
            {
                initialComponentsSchemas,
                componentsSchemasModel,
                rulesOverridesCache,
                depsResolutionOrder,
                componentsDepsFromSchema,
                operatorsForConditions,
                relationsRulesMap,
                hiddenComponents,
            },
            { id: componentIdToUpdate, data: propertiesToUpdate },
        ) => {
            const componentsSchemas = Object.entries(Object.fromEntries(componentsSchemasModel)).reduce<ComponentsSchemas>(
                (obj, [componentId, data]) => ({ ...obj, [componentId]: data.$model.getState() }),
                {},
            )

            const componentsIdsToUpdates: Set<EntityId> = new Set()
            componentsIdsToUpdates.add(componentIdToUpdate)

            const newRulesOverridesCache = cloneDeep(rulesOverridesCache)
            const newComponentsSchemas = cloneDeep(componentsSchemas)
            newComponentsSchemas[componentIdToUpdate].properties = {
                ...newComponentsSchemas[componentIdToUpdate].properties,
                ...propertiesToUpdate,
            }

            const executorContext: RuleExecutorContext = {
                getComponentSchemaById: (componentId: EntityId) => {
                    const schema = newComponentsSchemas[componentId] || null
                    return !schema?.visability?.hidden ? schema : null
                },
                getRepeaterChildIds: (componentId: EntityId) => {
                    console.log(componentId)
                    return []
                },
                isTemplateComponentId: (componentId: EntityId) => {
                    console.log(componentId)
                    return false
                },
            }

            const runCalcRules = (componentId: EntityId) => {
                const componentModel = newComponentsSchemas[componentId]
                const relationsRules = componentModel.relations

                const iterationsRelationsRulesAppliedCache: StoreValue<typeof $rulesOverridesCache> = {}

                relationsRules?.options?.forEach(({ id: ruleId, ruleName, options, condition }) => {
                    if (isEmpty(condition)) {
                        return
                    }

                    const canBeApply = isConditionSuccessful({ ctx: executorContext, condition, operators: operatorsForConditions })
                    const isActiveRule = ruleId in newRulesOverridesCache

                    if (canBeApply) {
                        const rule = relationsRulesMap[ruleName]
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

                        let iterationsUpdatedProperties = Object.entries(iterationsRelationsRulesAppliedCache).reduce<string[]>(
                            (arr, [_, appliedComponentProperties]) => {
                                if (isNotEmpty(appliedComponentProperties)) {
                                    return [...arr, ...Object.keys(appliedComponentProperties)]
                                }
                                return arr
                            },
                            [],
                        )
                        iterationsUpdatedProperties = Array.from(new Set(iterationsUpdatedProperties))

                        const propertiesKeysToRollback = ruleLatestAppliedKeysCache.filter((key) => !iterationsUpdatedProperties.includes(key))

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
            depsResolutionOrder[componentIdToUpdate]?.forEach((depComponentId) => {
                // 1.1 Проверить есть ли не скрытые зависимости. Если есть - идём дальше. Если нет - выход.
                // 1.2 Так же идём дальше если нет зависимостей вообще.
                const deps = componentsDepsFromSchema.reverseDepsGraph[depComponentId]
                const existsVisibleDep = isNotEmpty(deps) ? deps.some((componentId) => !finalHiddenComponents.has(componentId)) : true
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
        clock: executeRelationsRulesEvent,
        fn: ({ componentsSchemasToUpdate }) => componentsSchemasToUpdate,
        target: updateComponentsSchemasModelFx,
    })

    sample({
        clock: executeRelationsRulesEvent,
        fn: ({ rulesOverridesCacheToUpdate }) => rulesOverridesCacheToUpdate,
        target: setRulesOverridesCacheEvent,
    })

    sample({
        clock: executeRelationsRulesEvent,
        fn: ({ hiddenComponents }) => hiddenComponents,
        target: setHiddenComponentsEvent,
    })
}
