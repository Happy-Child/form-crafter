import { ComponentSchema, defaultMutationActivationStrategy, defaultMutationRollbackStrategy, EntityId } from '@form-crafter/core'
import { isEmpty, isNotEmpty } from '@form-crafter/utils'
import { createEvent, createStore, sample } from 'effector'
import { cloneDeep, isEqual, omit, pick } from 'lodash-es'
import { combineEvents } from 'patronum'

import { SchemaService } from '../../../schema'
import { ThemeService } from '../../../theme'
import { ComponentsModel } from '../components-model'
import { isChangedValue } from '../components-model/models/variants'
import { MutationsCache, RunMutationsPayload } from './types'

type Params = {
    componentsModel: ComponentsModel
    themeService: ThemeService
    schemaService: SchemaService
}

export type MutationsModel = ReturnType<typeof createMutationsModel>

export const createMutationsModel = ({ componentsModel, themeService, schemaService }: Params) => {
    const $activatedRules = createStore<Set<EntityId>>(new Set())
    const $mutationsCache = createStore<MutationsCache>({})

    const setActivatedRules = createEvent<Set<EntityId>>('setActivatedRules')
    const setMutationsCache = createEvent<MutationsCache>('setMutationsCache')

    const calcMutations = createEvent<RunMutationsPayload>('calcMutations')

    $activatedRules.on(setActivatedRules, (_, rules) => rules)
    $mutationsCache.on(setMutationsCache, (_, newCache) => newCache)

    const resultOfCalcMutations = sample({
        source: {
            getExecutorContextBuilder: componentsModel.$getExecutorContextBuilder,
            getIsConditionSuccessfulChecker: componentsModel.$getIsConditionSuccessfulChecker,
            initialComponentsSchemas: schemaService.$initialComponentsSchemas,
            activatedRules: $activatedRules,
            mutationsCache: $mutationsCache,
            themeMutationsRules: themeService.$mutationsRules,
            themeMutationsRulesRollback: themeService.$mutationsRulesRollback,
            hiddenComponents: componentsModel.$hiddenComponents,
        },
        clock: calcMutations,
        fn: (
            {
                getExecutorContextBuilder,
                getIsConditionSuccessfulChecker,
                initialComponentsSchemas,
                activatedRules,
                mutationsCache,
                themeMutationsRules,
                themeMutationsRulesRollback,
                hiddenComponents,
            },
            { curComponentsSchemas, newComponentsSchemas, componentsIdsToUpdate, depsForMutationsResolution },
        ) => {
            const componentsIdsToUpdates: Set<EntityId> = new Set(componentsIdsToUpdate)

            const newActivatedRules = new Set(activatedRules)
            const newMutationsCache = cloneDeep(mutationsCache)
            newComponentsSchemas = cloneDeep(newComponentsSchemas)

            const executorContext = getExecutorContextBuilder({ componentsSchemas: newComponentsSchemas })
            const isConditionSuccessfulChecker = getIsConditionSuccessfulChecker({ ctx: executorContext })

            const runCalcMutations = (componentId: EntityId) => {
                const componentSchema = newComponentsSchemas[componentId]
                const componentMutations = componentSchema.mutations

                componentMutations?.schemas?.forEach(({ id: ruleId, key, options, condition, strategies }) => {
                    const applyMutation = () => {
                        const rule = themeMutationsRules[key]

                        const nextProperties = rule.execute(componentSchema, { options: options || {}, ctx: executorContext })

                        if (!isNotEmpty(nextProperties)) {
                            return
                        }

                        const isNewProperties = Object.entries(nextProperties).some(([key, value]) => !isEqual(value, newMutationsCache[ruleId]?.[key]))
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

                        newActivatedRules.add(ruleId)
                        newMutationsCache[ruleId] = { ...newMutationsCache[ruleId], ...nextProperties }
                    }

                    const rollbackMutation = () => {
                        const ruleRollback = themeMutationsRulesRollback[key]
                        const finalStrategy = strategies?.rollback || defaultMutationRollbackStrategy

                        let finalProperties = newComponentsSchemas[componentId].properties

                        switch (finalStrategy) {
                            case 'skip': {
                                break
                            }
                            case 'restore-initial': {
                                const propertiesKeysToRollback = Object.keys(newMutationsCache[ruleId] || {})
                                const propertiesToRollback = pick(initialComponentsSchemas[componentId].properties, propertiesKeysToRollback)

                                finalProperties = {
                                    ...omit(finalProperties, propertiesKeysToRollback),
                                    ...propertiesToRollback,
                                }

                                break
                            }
                            default: {
                                const rollbackFn = ruleRollback.additionalStrategies![finalStrategy].toRollback
                                const propertiesToRollback = rollbackFn(componentSchema, { options: options || {}, ctx: executorContext })

                                finalProperties = {
                                    ...finalProperties,
                                    ...propertiesToRollback,
                                }
                            }
                        }

                        newComponentsSchemas[componentId] = {
                            ...newComponentsSchemas[componentId],
                            properties: finalProperties,
                        } as ComponentSchema

                        delete newMutationsCache[ruleId]

                        componentsIdsToUpdates.add(componentId)
                    }

                    if (isEmpty(condition)) {
                        applyMutation()
                        return
                    }

                    const ruleWasActivated = newActivatedRules.has(ruleId)
                    const finalStrategy = strategies?.activation || defaultMutationActivationStrategy

                    switch (finalStrategy) {
                        case 'once': {
                            const canBeApply = isConditionSuccessfulChecker({ condition })

                            if (!ruleWasActivated && canBeApply) {
                                applyMutation()
                                break
                            }

                            if (ruleWasActivated && !canBeApply) {
                                rollbackMutation()
                            }

                            break
                        }
                        case 'always': {
                            const canBeApply = isConditionSuccessfulChecker({ condition })
                            if (canBeApply) {
                                applyMutation()
                            } else if (ruleWasActivated) {
                                rollbackMutation()
                            }

                            break
                        }
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
                newActivatedRulesToUpdate: newActivatedRules,
                mutationsCacheToUpdate: newMutationsCache,
                hiddenComponents: finalHiddenComponents,
            }
        },
    })

    sample({
        clock: resultOfCalcMutations,
        fn: ({ newActivatedRulesToUpdate }) => newActivatedRulesToUpdate,
        target: setActivatedRules,
    })

    sample({
        clock: resultOfCalcMutations,
        fn: ({ mutationsCacheToUpdate }) => mutationsCacheToUpdate,
        target: setMutationsCache,
    })

    const componentsIsUpdatedAfterMutations = sample({
        clock: combineEvents([resultOfCalcMutations, componentsModel.updateModelsFx.done]),
        fn: ([{ componentsToUpdate }]) => ({ componentsToUpdate }),
    })

    return {
        calcMutations,
        resultOfCalcMutations,
        componentsIsUpdatedAfterMutations,
    }
}
