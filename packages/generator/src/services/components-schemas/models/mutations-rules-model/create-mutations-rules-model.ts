import { ComponentSchema, EntityId } from '@form-crafter/core'
import { isEmpty, isNotEmpty } from '@form-crafter/utils'
import { createEvent, createStore, sample, StoreValue } from 'effector'
import { cloneDeep, isEqual, pick } from 'lodash-es'
import { combineEvents } from 'patronum'

import { SchemaService } from '../../../schema'
import { ThemeService } from '../../../theme'
import { isChangedValue } from '../components'
import { ComponentsModel } from '../components-model'
import { VisabilityComponentsModel } from '../visability-components-model'
import { RulesOverridesCache, RunMutationRulesPayload } from './types'

type Params = {
    componentsModel: ComponentsModel
    visabilityComponentsModel: VisabilityComponentsModel
    themeService: ThemeService
    schemaService: SchemaService
}

export type MutationsRulesModel = ReturnType<typeof createMutationsRulesModel>

export const createMutationsRulesModel = ({ componentsModel, visabilityComponentsModel, themeService, schemaService }: Params) => {
    const $rulesOverridesCache = createStore<RulesOverridesCache>({})

    const setRulesOverridesCacheEvent = createEvent<RulesOverridesCache>('setRulesOverridesCacheEvent')

    const calcMutationsEvent = createEvent<RunMutationRulesPayload>('calcMutationsEvent')

    $rulesOverridesCache.on(setRulesOverridesCacheEvent, (_, newCache) => newCache)

    const resultOfCalcMutationsEvent = sample({
        source: {
            getExecutorContextBuilder: componentsModel.$getExecutorContextBuilder,
            getIsConditionSuccessfulChecker: componentsModel.$getIsConditionSuccessfulChecker,
            initialComponentsSchemas: schemaService.$initialComponentsSchemas,
            rulesOverridesCache: $rulesOverridesCache,
            mutationsRules: themeService.$mutationsRules,
            hiddenComponentsIds: visabilityComponentsModel.$hiddenComponentsIds,
        },
        clock: calcMutationsEvent,
        fn: (
            { getExecutorContextBuilder, getIsConditionSuccessfulChecker, initialComponentsSchemas, rulesOverridesCache, mutationsRules, hiddenComponentsIds },
            { curComponentsSchemas, newComponentsSchemas, componentsIdsToUpdate, depsForMutationResolution },
        ) => {
            const componentsIdsToUpdates: Set<EntityId> = new Set(componentsIdsToUpdate)

            const newRulesOverridesCache = cloneDeep(rulesOverridesCache)
            newComponentsSchemas = cloneDeep(newComponentsSchemas)

            const executorContext = getExecutorContextBuilder({ componentsSchemas: newComponentsSchemas })
            const isConditionSuccessfulChecker = getIsConditionSuccessfulChecker({ ctx: executorContext })

            const runCalcMutations = (componentId: EntityId) => {
                console.log('runCalcMutations componentId: ', componentId)
                const componentSchema = newComponentsSchemas[componentId]
                const componentMutations = componentSchema.mutations

                const iterationsAppliedCache: StoreValue<typeof $rulesOverridesCache> = {}

                componentMutations?.schemas?.forEach(({ id: ruleId, key, options, condition }) => {
                    if (isEmpty(condition)) {
                        return
                    }

                    const canBeApply = isConditionSuccessfulChecker({ condition })

                    const isActiveRule = ruleId in newRulesOverridesCache

                    if (canBeApply) {
                        const rule = mutationsRules[key]

                        const newProperties = rule.execute(componentSchema, { options: options || {}, ctx: executorContext })

                        if (!isNotEmpty(newProperties)) {
                            return
                        }

                        // но properties могут меняться у компонента после применения правила, что тут тогда? Выглядит как одно из возможный решений.
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

            depsForMutationResolution.forEach((depComponentId) => {
                // 1.1 Проверить есть ли обновлённые и не скрытые зависимости. Если есть или если вообще нет зависимостей - идём дальше. Если нет таких - выход.
                // const subDeps = depsTriggeringMutations.componentIdToDeps[depComponentId]
                // const someDepIsVisible = subDeps.some((componentId) => !finalHiddenComponentsIds.has(componentId))
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

            return {
                componentsToUpdate,
                newComponentsSchemas,
                rulesOverridesCacheToUpdate: newRulesOverridesCache,
                hiddenComponentsIds: finalHiddenComponentsIds,
            }
        },
    })

    sample({
        clock: resultOfCalcMutationsEvent,
        fn: ({ rulesOverridesCacheToUpdate }) => rulesOverridesCacheToUpdate,
        target: setRulesOverridesCacheEvent,
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
