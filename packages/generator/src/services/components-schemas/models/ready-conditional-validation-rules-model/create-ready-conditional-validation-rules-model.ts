import { EntityId } from '@form-crafter/core'
import { differenceSet, isEmpty, isNotEmpty } from '@form-crafter/utils'
import { combine, createEvent, createStore, sample, UnitValue } from 'effector'
import { cloneDeep } from 'lodash-es'

import { isConditionSuccessful } from '../../../../utils'
import { SchemaService } from '../../../schema'
import { ThemeService } from '../../../theme'
import { ComponentsModel, ComponentToUpdate } from '../components-model'
import { DepsOfRulesModel } from '../deps-of-rules-model'
import { CalcReadyConditionalValidationRulesPayload, ReadyValidationsRules, ReadyValidationsRulesByKey } from './types'
import { removeReadyValidationRules } from './utils'

type Params = {
    schemaService: SchemaService
    themeService: ThemeService
    depsOfRulesModel: DepsOfRulesModel
    componentsModel: ComponentsModel
}

export type ReadyConditionalValidationRulesModel = ReturnType<typeof createReadyConditionalValidationRulesModel>

export const createReadyConditionalValidationRulesModel = ({ schemaService, themeService, depsOfRulesModel, componentsModel }: Params) => {
    const $readyComponentsRules = createStore<ReadyValidationsRules>({})
    const $readyComponentsRulesByKey = createStore<ReadyValidationsRulesByKey>({})
    const $readyComponentsRulesIds = combine($readyComponentsRules, (readyRules) =>
        Object.entries(readyRules).reduce<ReadyValidationsRules[keyof ReadyValidationsRules]>(
            (result, [, readyRulesIds]) => new Set([...result, ...readyRulesIds]),
            new Set(),
        ),
    )

    const $readyGroupsRules = createStore<ReadyValidationsRules[keyof ReadyValidationsRules]>(new Set())
    const $readyGroupsByKey = createStore<ReadyValidationsRulesByKey[keyof ReadyValidationsRulesByKey]>({})

    const calcReadyRulesEvent = createEvent<CalcReadyConditionalValidationRulesPayload>('calcReadyRulesEvent')
    const calcReadyRulesGuardEvent = createEvent<CalcReadyConditionalValidationRulesPayload>('calcReadyRulesGuardEvent')

    const setReadyComponentsRulesEvent = createEvent<UnitValue<typeof $readyComponentsRules>>('setReadyComponentsRulesEvent')
    const setReadyComponentsRulesByKeyEvent = createEvent<UnitValue<typeof $readyComponentsRulesByKey>>('setReadyComponentsRulesByKeyEvent')
    const removeReadyComponentsRulesEvent = createEvent<Set<EntityId>>('removeReadyComponentsRulesEvent')
    const removeReadyComponentsRulesByKeyEvent = createEvent<Set<EntityId>>('removeReadyComponentsRulesByKeyEvent')

    const setReadyGroupRulesEvent = createEvent<UnitValue<typeof $readyGroupsRules>>('setReadyGroupRulesEvent')
    const setReadyGroupRulesByKeyEvent = createEvent<UnitValue<typeof $readyGroupsByKey>>('setReadyGroupRulesByKeyEvent')
    const removeReadyGroupRulesEvent = createEvent<Set<EntityId>>('removeReadyGroupRulesEvent')
    const removeReadyGroupRulesByKeyEvent = createEvent<Set<EntityId>>('removeReadyGroupRulesByKeyEvent')

    $readyComponentsRules.on(setReadyComponentsRulesEvent, (_, readyRules) => readyRules)
    $readyComponentsRulesByKey.on(setReadyComponentsRulesByKeyEvent, (_, readyRules) => readyRules)

    $readyComponentsRules.on(removeReadyComponentsRulesEvent, removeReadyValidationRules)
    $readyComponentsRulesByKey.on(removeReadyComponentsRulesByKeyEvent, (curReadyRules, rulesIdsToRemove) => {
        const result = Object.entries(curReadyRules).reduce<UnitValue<typeof $readyComponentsRulesByKey>>((curReadyRules, [componentId, readyRules]) => {
            const updatedReadyRules = removeReadyValidationRules(readyRules, rulesIdsToRemove)
            if (isEmpty(updatedReadyRules)) {
                delete curReadyRules[componentId]
            } else {
                curReadyRules[componentId] = updatedReadyRules
            }
            return curReadyRules
        }, {})
        return { ...result }
    })

    $readyGroupsRules.on(setReadyGroupRulesEvent, (_, readyRules) => readyRules)
    $readyGroupsByKey.on(setReadyGroupRulesByKeyEvent, (_, readyRules) => readyRules)

    $readyGroupsRules.on(removeReadyGroupRulesEvent, differenceSet)
    $readyGroupsByKey.on(removeReadyGroupRulesByKeyEvent, removeReadyValidationRules)

    sample({
        clock: calcReadyRulesGuardEvent,
        filter: ({ componentsToUpdate }) => componentsToUpdate.some(({ isNewValue }) => !!isNewValue),
        fn: ({ componentsToUpdate, ...params }) => ({ ...params, componentsToUpdate: componentsToUpdate.filter(({ isNewValue }) => !!isNewValue) }),
        target: calcReadyRulesEvent,
    })

    const resultOfCalcReadyRulesEvent = sample({
        source: {
            validationRuleSchemas: schemaService.$componentsValidationSchemas,
            groupValidationSchemas: schemaService.$groupValidationSchemas,
            operators: themeService.$operators,
            componentsValidationsConditionsDeps: depsOfRulesModel.$componentsValidationsConditionsDeps,
            groupsValidationsConditionsDeps: depsOfRulesModel.$groupsValidationsConditionsDeps,
            readyComponentsRules: $readyComponentsRules,
            readyComponentsRulesByKey: $readyComponentsRulesByKey,
            readyComponentsRulesIds: $readyComponentsRulesIds,
            readyGroupsRules: $readyGroupsRules,
            readyGroupsByKey: $readyGroupsByKey,
            getExecutorContextBuilder: componentsModel.$getExecutorContextBuilder,
            getIsConditionSuccessfulChecker: componentsModel.$getIsConditionSuccessfulChecker,
        },
        clock: calcReadyRulesEvent,
        fn: (
            {
                validationRuleSchemas,
                groupValidationSchemas,
                componentsValidationsConditionsDeps,
                groupsValidationsConditionsDeps,
                operators,
                readyComponentsRules,
                readyComponentsRulesByKey,
                readyComponentsRulesIds,
                readyGroupsRules,
                readyGroupsByKey,
                getExecutorContextBuilder,
                getIsConditionSuccessfulChecker,
            },
            { newComponentsSchemas, componentsToUpdate, skipIfValueUnchanged = true },
        ) => {
            const executorContext = getExecutorContextBuilder({ componentsSchemas: newComponentsSchemas })
            const isConditionSuccessfulChecker = getIsConditionSuccessfulChecker({ ctx: executorContext })

            const readyRules = cloneDeep(readyComponentsRules)
            const readyRulesByKey = cloneDeep(readyComponentsRulesByKey)

            const readyGroupRules = cloneDeep(readyGroupsRules)
            const readyGroupRulesByKey = cloneDeep(readyGroupsByKey)

            const rulesToInactive: Set<EntityId> = new Set()

            const canBeContinueValidation = (isNewValue?: boolean) => {
                if (skipIfValueUnchanged && !isNewValue) {
                    return false
                }

                return true
            }

            const initReadyRules = (ownerComponentId: EntityId, key: string) => {
                if (!(ownerComponentId in readyRules)) {
                    readyRules[ownerComponentId] = new Set()
                }

                if (!(ownerComponentId in readyRulesByKey)) {
                    readyRulesByKey[ownerComponentId] = {}
                }

                const currentReadyByKey = readyRulesByKey[ownerComponentId]
                if (!(key in currentReadyByKey)) {
                    currentReadyByKey[key] = new Set()
                }
            }

            const initReadyGroupRules = (key: string) => {
                if (!(key in readyGroupRulesByKey)) {
                    readyGroupRulesByKey[key] = new Set()
                }
            }

            const calcReadyRules = ({ componentId, isNewValue }: ComponentToUpdate) => {
                const canBeContinue = canBeContinueValidation(isNewValue)

                if (!canBeContinue) {
                    return
                }

                const dependentsValidationsIds = componentsValidationsConditionsDeps.componentsToDependentsRuleIds[componentId]

                if (!isNotEmpty(dependentsValidationsIds)) {
                    return
                }

                const evokedValidationsRules: Set<EntityId> = new Set()

                dependentsValidationsIds.forEach((validationSchemaId) => {
                    if (evokedValidationsRules.has(validationSchemaId)) {
                        return
                    }

                    const { ownerComponentId, schema: validationRuleSchema } = validationRuleSchemas[validationSchemaId]
                    const ruleIsReady = isConditionSuccessfulChecker({
                        condition: validationRuleSchema.condition!,
                    })

                    const isReadyRuleNow = readyComponentsRulesIds.has(validationSchemaId)
                    if (!ruleIsReady && isReadyRuleNow) {
                        // TODO не понятно что rulesToInactive для удаления ошибок которые активны сейчас, но правила для них стали не актиаными
                        // можно убрать это и подписаться на readyComponentsRules + preview и сравнить что пропало, и удалить ошибки для них
                        rulesToInactive.add(validationSchemaId)
                    }

                    initReadyRules(ownerComponentId, validationRuleSchema.key)

                    if (ruleIsReady) {
                        readyRules[ownerComponentId].add(validationSchemaId)
                        readyRulesByKey[ownerComponentId][validationRuleSchema.key].add(validationSchemaId)

                        evokedValidationsRules.add(validationSchemaId)
                    } else {
                        readyRules[ownerComponentId].delete(validationSchemaId)
                        readyRulesByKey[ownerComponentId][validationRuleSchema.key].delete(validationSchemaId)
                    }
                })
            }

            const calcReadyGroupRules = ({ componentId, isNewValue }: ComponentToUpdate) => {
                const canBeContinue = canBeContinueValidation(isNewValue)
                if (!canBeContinue) {
                    return
                }

                const dependentsValidationsIds = groupsValidationsConditionsDeps.componentsToDependentsRuleIds[componentId]
                if (!isNotEmpty(dependentsValidationsIds)) {
                    return
                }

                const evokedValidationsRules: Set<EntityId> = new Set()

                dependentsValidationsIds.forEach((validationSchemaId) => {
                    if (evokedValidationsRules.has(validationSchemaId)) {
                        return
                    }

                    const validationRuleSchema = groupValidationSchemas[validationSchemaId]

                    const ruleIsReady = isConditionSuccessful({
                        ctx: executorContext,
                        condition: validationRuleSchema.condition!,
                        operators: operators,
                    })

                    const isReadyRuleNow = readyGroupsRules.has(validationSchemaId)
                    if (!ruleIsReady && isReadyRuleNow) {
                        rulesToInactive.add(validationSchemaId)
                    }

                    initReadyGroupRules(validationRuleSchema.key)

                    if (ruleIsReady) {
                        readyGroupRules.add(validationSchemaId)
                        readyGroupRulesByKey[validationRuleSchema.key].add(validationSchemaId)

                        evokedValidationsRules.add(validationSchemaId)
                    } else {
                        readyGroupRules.delete(validationSchemaId)
                        readyGroupRulesByKey[validationRuleSchema.key].delete(validationSchemaId)
                    }
                })
            }

            componentsToUpdate.forEach((data) => {
                calcReadyRules(data)
                calcReadyGroupRules(data)
            })

            return {
                readyRules,
                readyRulesByKey,
                readyGroupRules,
                readyGroupRulesByKey,
                rulesToInactive,
            }
        },
    })

    sample({
        clock: resultOfCalcReadyRulesEvent,
        filter: ({ readyRules }) => isNotEmpty(readyRules),
        fn: ({ readyRules }) => readyRules,
        target: setReadyComponentsRulesEvent,
    })

    sample({
        clock: resultOfCalcReadyRulesEvent,
        filter: ({ readyRulesByKey }) => isNotEmpty(readyRulesByKey),
        fn: ({ readyRulesByKey }) => readyRulesByKey,
        target: setReadyComponentsRulesByKeyEvent,
    })

    sample({
        clock: resultOfCalcReadyRulesEvent,
        filter: ({ readyGroupRules }) => isNotEmpty(readyGroupRules),
        fn: ({ readyGroupRules }) => readyGroupRules,
        target: setReadyGroupRulesEvent,
    })

    sample({
        clock: resultOfCalcReadyRulesEvent,
        filter: ({ readyGroupRulesByKey }) => isNotEmpty(readyGroupRulesByKey),
        fn: ({ readyGroupRulesByKey }) => readyGroupRulesByKey,
        target: setReadyGroupRulesByKeyEvent,
    })

    return {
        calcReadyRulesEvent: calcReadyRulesGuardEvent,
        resultOfCalcReadyRulesEvent,
        $readyComponentsRules,
        $readyComponentsRulesByKey,
        $readyGroupsRules,
        $readyGroupsByKey,
    }
}
