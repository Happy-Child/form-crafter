import {
    CalcReadyConditionalValidationsPayload,
    ComponentToUpdate,
    EntityId,
    ReadyConditionalValidationsModel,
    ReadyValidations,
    ReadyValidationsByKey,
} from '@form-crafter/core'
import { differenceSet, isEmpty, isNotEmpty } from '@form-crafter/utils'
import { combine, createEvent, createStore, sample, UnitValue } from 'effector'
import { cloneDeep } from 'lodash-es'

import { SchemaService } from '../../../schema'
import { ComponentsRegistryModel } from '../components-registry-model'
import { DepsOfRulesModel } from '../deps-of-rules-model'
import { createComponentsValidationSchemasModel } from './models'
import { removeReadyValidationRules, removeRulesByComponentsIds } from './utils'

type Params = {
    schemaService: SchemaService
    depsOfRulesModel: DepsOfRulesModel
    componentsRegistryModel: Pick<ComponentsRegistryModel, '$getExecutorContextBuilder' | '$getIsConditionSuccessfulChecker' | 'componentsStoreModel'>
}

export const createReadyConditionalValidationsModel = ({
    schemaService,
    depsOfRulesModel,
    componentsRegistryModel,
}: Params): ReadyConditionalValidationsModel => {
    const $readyComponentsRules = createStore<ReadyValidations>({})
    const $readyComponentsRulesByKey = createStore<ReadyValidationsByKey>({})
    const $readyComponentsRulesIds = combine($readyComponentsRules, (readyRules) =>
        Object.entries(readyRules).reduce<ReadyValidations[keyof ReadyValidations]>(
            (result, [, readyRulesIds]) => new Set([...result, ...readyRulesIds]),
            new Set(),
        ),
    )

    const $readyGroupsRules = createStore<ReadyValidations[keyof ReadyValidations]>(new Set())
    const $readyGroupsByKey = createStore<ReadyValidationsByKey[keyof ReadyValidationsByKey]>({})

    const calcReadyValidations = createEvent<CalcReadyConditionalValidationsPayload>('calcReadyValidations')
    const calcReadyRulesGuard = createEvent<CalcReadyConditionalValidationsPayload>('calcReadyRulesGuard')

    const setReadyComponentsRules = createEvent<UnitValue<typeof $readyComponentsRules>>('setReadyComponentsRules')
    const setReadyComponentsRulesByKey = createEvent<UnitValue<typeof $readyComponentsRulesByKey>>('setReadyComponentsRulesByKey')
    const removeReadyComponentsRules = createEvent<Set<EntityId>>('removeReadyComponentsRules')
    const removeReadyComponentsRulesByKey = createEvent<Set<EntityId>>('removeReadyComponentsRulesByKey')

    const setReadyGroupRules = createEvent<UnitValue<typeof $readyGroupsRules>>('setReadyGroupRules')
    const setReadyGroupRulesByKey = createEvent<UnitValue<typeof $readyGroupsByKey>>('setReadyGroupRulesByKey')
    const removeReadyGroupRules = createEvent<Set<EntityId>>('removeReadyGroupRules')
    const removeReadyGroupRulesByKey = createEvent<Set<EntityId>>('removeReadyGroupRulesByKey')

    const removeReadyRulesByComponentsIds = createEvent<Set<EntityId>>('removeReadyRulesByComponentsIds')

    $readyComponentsRules.on(setReadyComponentsRules, (_, readyRules) => readyRules)
    $readyComponentsRulesByKey.on(setReadyComponentsRulesByKey, (_, readyRules) => readyRules)

    $readyComponentsRules.on(removeReadyComponentsRules, removeReadyValidationRules)
    $readyComponentsRulesByKey.on(removeReadyComponentsRulesByKey, (curReadyRules, rulesIdsToRemove) => {
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

    $readyComponentsRules.on(removeReadyRulesByComponentsIds, removeRulesByComponentsIds)
    $readyComponentsRulesByKey.on(removeReadyRulesByComponentsIds, removeRulesByComponentsIds)

    $readyGroupsRules.on(setReadyGroupRules, (_, readyRules) => readyRules)
    $readyGroupsByKey.on(setReadyGroupRulesByKey, (_, readyRules) => readyRules)

    $readyGroupsRules.on(removeReadyGroupRules, differenceSet)
    $readyGroupsByKey.on(removeReadyGroupRulesByKey, removeReadyValidationRules)

    const componentsValidationSchemasModel = createComponentsValidationSchemasModel({ componentsRegistryModel })

    sample({
        clock: calcReadyRulesGuard,
        filter: ({ componentsToUpdate }) => componentsToUpdate.some(({ isNewValue }) => !!isNewValue),
        fn: ({ componentsToUpdate, ...params }) => ({ ...params, componentsToUpdate: componentsToUpdate.filter(({ isNewValue }) => !!isNewValue) }),
        target: calcReadyValidations,
    })

    const resultOfCalcReadyValidations = sample({
        source: {
            validationRuleSchemas: componentsValidationSchemasModel.$schemas,
            groupValidationSchemas: schemaService.$groupValidationSchemas,
            activeViewComponentsValidationsConditionsDeps: depsOfRulesModel.$activeViewComponentsValidationsConditionsDeps,
            groupsValidationsConditionsDeps: depsOfRulesModel.$groupsValidationsConditionsDeps,
            readyComponentsRules: $readyComponentsRules,
            readyComponentsRulesByKey: $readyComponentsRulesByKey,
            readyComponentsRulesIds: $readyComponentsRulesIds,
            readyGroupsRules: $readyGroupsRules,
            readyGroupsByKey: $readyGroupsByKey,
            getExecutorContextBuilder: componentsRegistryModel.$getExecutorContextBuilder,
            getIsConditionSuccessfulChecker: componentsRegistryModel.$getIsConditionSuccessfulChecker,
        },
        clock: calcReadyValidations,
        fn: (
            {
                validationRuleSchemas,
                groupValidationSchemas,
                activeViewComponentsValidationsConditionsDeps,
                groupsValidationsConditionsDeps,
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

            const evokedValidationsRules: Set<EntityId> = new Set()

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
                if (!canBeContinueValidation(isNewValue)) {
                    return
                }

                const dependentsValidationsIds = activeViewComponentsValidationsConditionsDeps.componentIdToDependentsRuleIds[componentId]
                if (!isNotEmpty(dependentsValidationsIds)) {
                    return
                }

                dependentsValidationsIds.forEach((validationSchemaId) => {
                    if (evokedValidationsRules.has(validationSchemaId)) {
                        return
                    }

                    const { ownerComponentId, schema: validationRuleSchema } = validationRuleSchemas[validationSchemaId]
                    const ruleIsReady = isConditionSuccessfulChecker({
                        condition: validationRuleSchema.condition!,
                        ownerComponentId,
                    })

                    const isReadyRuleNow = readyComponentsRulesIds.has(validationSchemaId)
                    if (!ruleIsReady && isReadyRuleNow) {
                        // TODO не понятно что rulesToInactive для удаления ошибок которые активны сейчас, но правила для них стали не актиаными
                        // можно убрать это и подписаться на readyComponentsRules + previous и сравнить что пропало, и удалить ошибки для них
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

                const dependentsValidationsIds = groupsValidationsConditionsDeps.componentIdToDependentsRuleIds[componentId]
                if (!isNotEmpty(dependentsValidationsIds)) {
                    return
                }

                const evokedValidationsRules: Set<EntityId> = new Set()

                dependentsValidationsIds.forEach((validationSchemaId) => {
                    if (evokedValidationsRules.has(validationSchemaId)) {
                        return
                    }

                    const validationRuleSchema = groupValidationSchemas[validationSchemaId]
                    const ruleIsReady = isConditionSuccessfulChecker({
                        condition: validationRuleSchema.condition!,
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
        clock: resultOfCalcReadyValidations,
        filter: ({ readyRules }) => isNotEmpty(readyRules),
        fn: ({ readyRules }) => readyRules,
        target: setReadyComponentsRules,
    })

    sample({
        clock: resultOfCalcReadyValidations,
        filter: ({ readyRulesByKey }) => isNotEmpty(readyRulesByKey),
        fn: ({ readyRulesByKey }) => readyRulesByKey,
        target: setReadyComponentsRulesByKey,
    })

    sample({
        clock: resultOfCalcReadyValidations,
        filter: ({ readyGroupRules }) => isNotEmpty(readyGroupRules),
        fn: ({ readyGroupRules }) => readyGroupRules,
        target: setReadyGroupRules,
    })

    sample({
        clock: resultOfCalcReadyValidations,
        filter: ({ readyGroupRulesByKey }) => isNotEmpty(readyGroupRulesByKey),
        fn: ({ readyGroupRulesByKey }) => readyGroupRulesByKey,
        target: setReadyGroupRulesByKey,
    })

    return {
        calcReadyValidations: calcReadyRulesGuard,
        resultOfCalcReadyValidations,
        removeReadyRulesByComponentsIds,
        $readyComponentsRules,
        $readyComponentsRulesByKey,
        $readyGroupsRules,
        $readyGroupsByKey,
    }
}
