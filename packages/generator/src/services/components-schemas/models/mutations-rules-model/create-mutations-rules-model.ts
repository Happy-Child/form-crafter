import { ComponentSchema, EntityId, isConditionSuccessful } from '@form-crafter/core'
import { isEmpty, isNotEmpty } from '@form-crafter/utils'
import { createEvent, createStore, sample, StoreValue } from 'effector'
import { cloneDeep, isEqual, pick } from 'lodash-es'

import { SchemaService } from '../../../schema'
import { ThemeService } from '../../../theme'
import { isChangedValue } from '../components'
import { ComponentsModel } from '../components-model'
import { DepsOfRulesModel } from '../deps-of-rules-model'
import { VisabilityComponentsModel } from '../visability-components-model'
import { RulesOverridesCache, RunMutationRulesPayload } from './types'

type Params = {
    componentsModel: ComponentsModel
    depsOfRulesModel: DepsOfRulesModel
    visabilityComponentsModel: VisabilityComponentsModel
    themeService: ThemeService
    schemaService: SchemaService
}

export type MutationsRulesModel = ReturnType<typeof createMutationsRulesModel>

export const createMutationsRulesModel = ({ componentsModel, depsOfRulesModel, visabilityComponentsModel, themeService, schemaService }: Params) => {
    const $rulesOverridesCache = createStore<RulesOverridesCache>({})

    const setRulesOverridesCacheEvent = createEvent<RulesOverridesCache>('setRulesOverridesCacheEvent')

    const runMutationRulesEvent = createEvent<RunMutationRulesPayload>('runMutationRulesEvent')

    $rulesOverridesCache.on(setRulesOverridesCacheEvent, (_, newCache) => newCache)

    const resultOfRunMutationRulesEvent = sample({
        source: {
            getExecutorContextBuilder: componentsModel.$getExecutorContextBuilder,
            initialComponentsSchemas: schemaService.$initialComponentsSchemas,
            rulesOverridesCache: $rulesOverridesCache,
            componentsDepsTriggeredMutationRules: depsOfRulesModel.$componentsDepsTriggeredMutationRules,
            operators: themeService.$operators,
            mutationsRules: themeService.$mutationsRules,
            hiddenComponentsIds: visabilityComponentsModel.$hiddenComponentsIds,
        },
        clock: runMutationRulesEvent,
        fn: (
            {
                getExecutorContextBuilder,
                initialComponentsSchemas,
                rulesOverridesCache,
                componentsDepsTriggeredMutationRules,
                operators,
                mutationsRules,
                hiddenComponentsIds,
            },
            { curComponentsSchemas, newComponentsSchemas, componentsIdsToUpdate, componentsForMutationResolution },
        ) => {
            console.log('start runMutationRulesEvent: ', curComponentsSchemas, newComponentsSchemas)

            const componentsIdsToUpdates: Set<EntityId> = new Set(componentsIdsToUpdate)

            const newRulesOverridesCache = cloneDeep(rulesOverridesCache)
            newComponentsSchemas = cloneDeep(newComponentsSchemas)

            const executorContext = getExecutorContextBuilder({ componentsSchemas: newComponentsSchemas })

            const runCalcMutations = (componentId: EntityId) => {
                console.log('depComponentId ', componentId)

                const componentSchema = newComponentsSchemas[componentId]
                const componentMutations = componentSchema.mutations

                const iterationsAppliedCache: StoreValue<typeof $rulesOverridesCache> = {}

                componentMutations?.schemas?.forEach(({ id: ruleId, key, options, condition }) => {
                    if (isEmpty(condition)) {
                        return
                    }

                    // console.log('componentId ruleKey ruleId options: ', componentId, key, ruleId, options)
                    const canBeApply = isConditionSuccessful({ ctx: executorContext, condition, operators: operators })
                    const isActiveRule = ruleId in newRulesOverridesCache

                    if (canBeApply) {
                        const rule = mutationsRules[key]

                        const newProperties = rule.execute(componentSchema, { options: options || {}, ctx: executorContext })

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
                        iterationsAppliedCache[ruleId] = newProperties
                    } else if (isActiveRule) {
                        const ruleLatestAppliedKeysCache = Object.keys(newRulesOverridesCache[ruleId] || {})

                        let iterationsUpdatedKeysProperties = Object.entries(iterationsAppliedCache).reduce<string[]>((arr, [, appliedComponentProperties]) => {
                            if (isNotEmpty(appliedComponentProperties)) {
                                return [...arr, ...Object.keys(appliedComponentProperties)]
                            }
                            return arr
                        }, [])
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

            const finalHiddenComponentsIds: Set<EntityId> = new Set(hiddenComponentsIds)
            console.log('componentsIdsToUpdate: ', componentsIdsToUpdate)

            console.log('componentsForMutationResolution: ', componentsForMutationResolution)
            componentsForMutationResolution.forEach((depComponentId) => {
                // 1.1 Проверить есть ли не скрытые зависимости. Если есть - идём дальше. Если нет - выход.
                // 1.2 Так же идём дальше если нет зависимостей вообще.
                const dependents = componentsDepsTriggeredMutationRules.componentIdToDependents[depComponentId]
                const existsVisibleDep = isNotEmpty(dependents) ? dependents.some((componentId) => !finalHiddenComponentsIds.has(componentId)) : true
                console.log('dependents: ', dependents, existsVisibleDep)

                if (!existsVisibleDep) {
                    return
                }

                // 2. Если нет visability.condition выполняем runCalcMutations и выходим
                const visabilityCondition = newComponentsSchemas[depComponentId]?.visability?.condition
                if (isEmpty(visabilityCondition)) {
                    runCalcMutations(depComponentId)
                    return
                }

                // 3. Если статус видимости не изменился и если компонент не скрыт - вызываем runCalcMutations. Иначе выход
                const shouldBeHidden = isConditionSuccessful({ ctx: executorContext, condition: visabilityCondition, operators: operators })
                const componentIsHiddenNow = !!newComponentsSchemas[depComponentId].visability?.hidden
                const isNewVisabilityStatus = componentIsHiddenNow !== shouldBeHidden
                if (!isNewVisabilityStatus) {
                    if (!componentIsHiddenNow) {
                        runCalcMutations(depComponentId)
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
                    finalHiddenComponentsIds.add(depComponentId)

                    newComponentSchema.visability.hidden = true
                    newComponentsSchemas[depComponentId] = newComponentSchema

                    componentsIdsToUpdates.add(depComponentId)
                } else {
                    finalHiddenComponentsIds.delete(depComponentId)

                    newComponentSchema.visability.hidden = false
                    newComponentsSchemas[depComponentId] = newComponentSchema

                    // Нужно, так как в runCalcMutations не всегда depComponentId будет попадать в componentsIdsToUpdates
                    componentsIdsToUpdates.add(depComponentId)

                    runCalcMutations(depComponentId)
                }
            })

            const componentsToUpdate = Array.from(componentsIdsToUpdates)
                .filter((componentId) => {
                    const isEqualProperties = isEqual(curComponentsSchemas[componentId].properties, newComponentsSchemas[componentId].properties)
                    const isEqualHidden = !!curComponentsSchemas[componentId].visability?.hidden === !!newComponentsSchemas[componentId].visability?.hidden

                    return !isEqualProperties || !isEqualHidden
                })
                .map((componentId) => {
                    const schema = newComponentsSchemas[componentId]
                    const isNewValue = isChangedValue(curComponentsSchemas[componentId].properties.value, newComponentsSchemas[componentId].properties.value)

                    return {
                        componentId,
                        schema,
                        isNewValue,
                    }
                })

            return { componentsToUpdate, rulesOverridesCacheToUpdate: newRulesOverridesCache, hiddenComponentsIds: finalHiddenComponentsIds }
        },
    })

    return {
        runMutationRulesEvent,
        resultOfRunMutationRulesEvent,
        setRulesOverridesCacheEvent,
    }
}
