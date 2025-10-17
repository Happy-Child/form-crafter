import { ComponentSchema, EntityId } from '@form-crafter/core'
import { isEmpty, isNotEmpty } from '@form-crafter/utils'
import { createEvent, createStore, sample, StoreValue } from 'effector'
import { cloneDeep, isEqual, omit, pick } from 'lodash-es'
import { combineEvents } from 'patronum'

import { SchemaService } from '../../../schema'
import { ThemeService } from '../../../theme'
import { ComponentsModel } from '../components-model'
import { isChangedValue } from '../components-model/models/components'
import { VisabilityComponentsModel } from '../visability-components-model'
import { MutationsOverridesCache, RunMutationsPayload } from './types'

type Params = {
    componentsModel: ComponentsModel
    visabilityComponentsModel: VisabilityComponentsModel
    themeService: ThemeService
    schemaService: SchemaService
}

export type MutationsModel = ReturnType<typeof createMutationsModel>

export const createMutationsModel = ({ componentsModel, visabilityComponentsModel, themeService, schemaService }: Params) => {
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
            hiddenComponents: visabilityComponentsModel.$hiddenComponents,
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

                        const newProperties = rule.execute(componentSchema, { options: options || {}, ctx: executorContext })

                        if (!isNotEmpty(newProperties)) {
                            return
                        }

                        // TODO2
                        // 1. Но properties могут меняться у компонента после применения правила, что тут тогда? Выглядит как одно из возможный решений.

                        // 2. Проблема так же имеется с мутацией duplicateValue:
                        // В поле Б дублируется значение из А
                        // В какой-то момент срабатывает мутаций на Б
                        // - Если поле Б пустое -> rule.execute возвращает properties: {value: valueA}
                        // - Если поле Б не пустое -> rule.execute возвращает null
                        // Проблема:
                        // Если правило становиться не активным (condition дали false), и если правило было активно ранее(то есть один раз вернуло valueA)
                        // и пользователь ввёл потом своё значение вместо valueA - МЫ ВЕРНЁМ VALUE ЗНАЧЕНИЕ ИЗ INITIAL SCHEMA перезаписал значение юзера.
                        // 2.1. И нужно дать возможность не возвращать initial значения когда правило стало неактивным.

                        // 3. Нужно сделать примнения одноразовым. Если поле Б не dirty и не touched -> менять значение value из поля А.
                        // Но это касаптся только поля value или любых поле properties? И выглядит так что это только на mutation duplicate value нужно.
                        // Сейчас мне кажется верным сделать это общим функционалом, но как дать юзеру выбиратт это тогда?

                        // 4. С change options select мутацией что делать? Ей нужно другое поведение совсем - постоянная проверка condition и если true -> применяем, false -> созвращаем initial.

                        // 5. bank account disabled if inn empty. но если на inn была данные, что-то ввели в bankAcctount и НО БИЗНЕСУ НУЖНО и очистить и disabled если inn пустой окажется, как?
                        // !!!! ЭТО СНОВА ГОВОРИТ ЧТО НУЖНО ДЕЛАТЬ МУТАЦИИ ПОСТОЯННЫЕ ПРИ CONIDTION=TRUE, и одноразовые даже если продолжает condition быть true
                        // НО ВОТ ГЛАВНАЯ ПРОБЛЕМА! Если одноразовая мутация стала true -> применалась, далее false, а через вреся СНОВА TRUE, что тогда?
                        // Решение - сделать 2 типа поведениия: 1. постоянное, 2. единоразовое. Единоразовые в свою очередь: 1. только первое срабатывание и ВСЁ, 2. Срабатывают при каждой активации.
                        // Выглядит ок, но а значения возвращаем при inactive? Иногда нужно, иногда нет. Снова нагружать юзера инфой (checkbox мол вызвращаться или нет)
                        // ААААААААААААА. Я в постоянные засунул те, у которых нельзя изменить значение после применения, так как cindition всё ещё true.

                        // Проверять dirty или touched можно из констекста (только это именно от юзера должны быть инфа, что из-за рук юзера обновили значение)
                        const isNewProperties = Object.entries(newProperties).some(([key, value]) => !isEqual(value, newOverridesCache[ruleId]?.[key]))
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

                        newOverridesCache[ruleId] = { ...newOverridesCache[ruleId], ...newProperties }
                        iterationsAppliedCache[ruleId] = newProperties
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
