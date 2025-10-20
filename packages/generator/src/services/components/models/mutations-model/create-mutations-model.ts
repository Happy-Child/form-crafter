import { ComponentSchema, EntityId } from '@form-crafter/core'
import { isEmpty, isNotEmpty } from '@form-crafter/utils'
import { createEvent, createStore, sample, StoreValue } from 'effector'
import { cloneDeep, isEqual, omit, pick } from 'lodash-es'
import { combineEvents } from 'patronum'

import { SchemaService } from '../../../schema'
import { ThemeService } from '../../../theme'
import { ComponentsModel } from '../components-model'
import { isChangedValue } from '../components-model/models/variants'
import { MutationsOverridesCache, RunMutationsPayload } from './types'

type Params = {
    componentsModel: ComponentsModel
    themeService: ThemeService
    schemaService: SchemaService
}

export type MutationsModel = ReturnType<typeof createMutationsModel>

export const createMutationsModel = ({ componentsModel, themeService, schemaService }: Params) => {
    const $overridesCache = createStore<MutationsOverridesCache>({})

    const setOverridesCacheEvent = createEvent<MutationsOverridesCache>('setOverridesCacheEvent')

    const calcMutationsEvent = createEvent<RunMutationsPayload>('calcMutationsEvent')

    $overridesCache.on(setOverridesCacheEvent, (_, newCache) => newCache)

    const resultOfCalcMutationsEvent = sample({
        source: {
            getExecutorContextBuilder: componentsModel.$getExecutorContextBuilder,
            getIsConditionSuccessfulChecker: componentsModel.$getIsConditionSuccessfulChecker,
            initialComponentsSchemas: schemaService.$initialComponentsSchemas,
            overridesCache: $overridesCache,
            themeMutationsRules: themeService.$mutationsRules,
            hiddenComponents: componentsModel.$hiddenComponents,
        },
        clock: calcMutationsEvent,
        fn: (
            { getExecutorContextBuilder, getIsConditionSuccessfulChecker, initialComponentsSchemas, overridesCache, themeMutationsRules, hiddenComponents },
            { curComponentsSchemas, newComponentsSchemas, componentsIdsToUpdate, depsForMutationsResolution },
        ) => {
            const componentsIdsToUpdates: Set<EntityId> = new Set(componentsIdsToUpdate)

            const newOverridesCache = cloneDeep(overridesCache)
            newComponentsSchemas = cloneDeep(newComponentsSchemas)

            const executorContext = getExecutorContextBuilder({ componentsSchemas: newComponentsSchemas })
            const isConditionSuccessfulChecker = getIsConditionSuccessfulChecker({ ctx: executorContext })

            const runCalcMutations = (componentId: EntityId) => {
                const componentSchema = newComponentsSchemas[componentId]
                const componentMutations = componentSchema.mutations

                const iterationsAppliedCache: StoreValue<typeof $overridesCache> = {}

                componentMutations?.schemas?.forEach(({ id: ruleId, key, options, condition }) => {
                    if (isEmpty(condition)) {
                        return
                    }

                    const canBeApply = isConditionSuccessfulChecker({ condition })
                    const isActiveRule = ruleId in newOverridesCache

                    if (canBeApply) {
                        const rule = themeMutationsRules[key]

                        const nextProperties = rule.execute(componentSchema, { options: options || {}, ctx: executorContext })

                        if (!isNotEmpty(nextProperties)) {
                            return
                        }

                        const isNewProperties = Object.entries(nextProperties).some(([key, value]) => !isEqual(value, newOverridesCache[ruleId]?.[key]))
                        if (isNewProperties) {
                            componentsIdsToUpdates.add(componentId)
                        }

                        newComponentsSchemas[componentId] = {
                            ...newComponentsSchemas[componentId],
                            properties: {
                                ...newComponentsSchemas[componentId].properties,
                                ...nextProperties,
                            },
                        } as ComponentSchema

                        newOverridesCache[ruleId] = { ...newOverridesCache[ruleId], ...nextProperties }
                        iterationsAppliedCache[ruleId] = nextProperties
                    } else if (isActiveRule) {
                        const ruleLatestAppliedKeysCache = Object.keys(newOverridesCache[ruleId] || {})

                        let iterationsUpdatedKeysProperties = Object.entries(iterationsAppliedCache).reduce<string[]>((arr, [, appliedComponentProperties]) => {
                            if (isNotEmpty(appliedComponentProperties)) {
                                return [...arr, ...Object.keys(appliedComponentProperties)]
                            }
                            return arr
                        }, [])
                        iterationsUpdatedKeysProperties = Array.from(new Set(iterationsUpdatedKeysProperties))

                        const propertiesKeysToRollback = ruleLatestAppliedKeysCache.filter((key) => !iterationsUpdatedKeysProperties.includes(key))
                        const propertiesToRollback = pick(initialComponentsSchemas[componentId].properties, propertiesKeysToRollback)

                        const finalProperties = omit(newComponentsSchemas[componentId].properties, propertiesKeysToRollback)

                        newComponentsSchemas[componentId] = {
                            ...newComponentsSchemas[componentId],
                            properties: {
                                ...finalProperties,
                                ...propertiesToRollback,
                            },
                        } as ComponentSchema

                        delete newOverridesCache[ruleId]

                        componentsIdsToUpdates.add(componentId)
                    }
                })
            }

            const finalHiddenComponents: Set<EntityId> = new Set(hiddenComponents)

            depsForMutationsResolution.forEach((depComponentId) => {
                // 1.1 Проверить есть ли обновлённые и не скрытые зависимости. Если есть или если вообще нет зависимостей - идём дальше. Если нет таких - выход.
                // const subDeps = depsTriggeringMutations.componentIdToDeps[depComponentId]
                // const someDepIsVisible = subDeps.some((componentId) => !finalHiddenComponents.has(componentId))
                // const someDepIsUpdated = subDeps.some((componentId) => componentsIdsToUpdates.has(componentId))

                // const someDepIsUpdatedAndVisible = isNotEmpty(subDeps) ? someDepIsVisible && someDepIsUpdated : true

                // if (!someDepIsUpdatedAndVisible) {
                //     return
                // }

                // 2. Если нет visability.condition выполняем runCalcMutations и выходим
                const visabilityCondition = newComponentsSchemas[depComponentId]?.visability?.condition
                if (isEmpty(visabilityCondition)) {
                    runCalcMutations(depComponentId)
                    return
                }

                // 3. Если статус видимости не изменился и если компонент не скрыт - вызываем runCalcMutations. Иначе выход
                const shouldBeHidden = isConditionSuccessfulChecker({ condition: visabilityCondition })

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
                    finalHiddenComponents.add(depComponentId)

                    newComponentSchema.visability.hidden = true
                    newComponentsSchemas[depComponentId] = newComponentSchema

                    componentsIdsToUpdates.add(depComponentId)
                } else {
                    finalHiddenComponents.delete(depComponentId)

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

            return {
                componentsToUpdate,
                newComponentsSchemas,
                overridesCacheToUpdate: newOverridesCache,
                hiddenComponents: finalHiddenComponents,
            }
        },
    })

    sample({
        clock: resultOfCalcMutationsEvent,
        fn: ({ overridesCacheToUpdate }) => overridesCacheToUpdate,
        target: setOverridesCacheEvent,
    })

    const componentsIsUpdatedAfterMutationsEvent = sample({
        clock: combineEvents([resultOfCalcMutationsEvent, componentsModel.updateModelsFx.done]),
        fn: ([{ componentsToUpdate }]) => ({ componentsToUpdate }),
    })

    return {
        calcMutationsEvent,
        resultOfCalcMutationsEvent,
        componentsIsUpdatedAfterMutationsEvent,
    }
}
