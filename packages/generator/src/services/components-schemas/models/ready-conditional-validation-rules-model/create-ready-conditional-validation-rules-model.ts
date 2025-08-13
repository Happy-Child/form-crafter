import { ComponentSchema, EntityId, isConditionSuccessful } from '@form-crafter/core'
import { differenceSet, isEmpty, isNotEmpty } from '@form-crafter/utils'
import { combine, createEvent, createStore, sample, UnitValue } from 'effector'
import { cloneDeep, isEqual, merge } from 'lodash-es'

import { SchemaService } from '../../../schema'
import { ThemeService } from '../../../theme'
import { ComponentsModel } from '../components-model'
import { DepsOfRulesModel } from '../deps-of-rules-model'
import { CalcReadyConditionalValidationRulesPayload, ReadyValidationsRules, ReadyValidationsRulesByRuleName } from './types'
import { removeReadyValidationRules } from './utils'

type Params = {
    schemaService: Pick<SchemaService, '$componentsValidationSchemas' | '$groupValidationSchemas'>
    themeService: Pick<ThemeService, '$operatorsForConditions'>
    depsOfRulesModel: Pick<DepsOfRulesModel, '$depsComponentsRuleSchemas' | '$depsGroupsValidationRuleSchemas'>
    componentsModel: Pick<ComponentsModel, '$componentsSchemas' | '$getExecutorContextBuilder'>
}

export type ReadyConditionalValidationRulesModel = ReturnType<typeof createReadyConditionalValidationRulesModel>

export const createReadyConditionalValidationRulesModel = ({ schemaService, themeService, depsOfRulesModel, componentsModel }: Params) => {
    const $readyComponentsRules = createStore<ReadyValidationsRules>({})
    const $readyComponentsRulesByRuleName = createStore<ReadyValidationsRulesByRuleName>({})
    const $readyComponentsRulesIds = combine($readyComponentsRules, (readyRules) =>
        Object.entries(readyRules).reduce<ReadyValidationsRules[keyof ReadyValidationsRules]>(
            (result, [, readyRulesIds]) => new Set([...result, ...readyRulesIds]),
            new Set(),
        ),
    )

    const $readyGroupsRules = createStore<ReadyValidationsRules[keyof ReadyValidationsRules]>(new Set())
    const $readyGroupsByRuleName = createStore<ReadyValidationsRulesByRuleName[keyof ReadyValidationsRulesByRuleName]>({})

    const calcReadyRulesEvent = createEvent<CalcReadyConditionalValidationRulesPayload>('calcReadyRulesEvent')

    const setReadyComponentsRulesEvent = createEvent<UnitValue<typeof $readyComponentsRules>>('setReadyComponentsRulesEvent')
    const setReadyComponentsRulesByRuleNameEvent = createEvent<UnitValue<typeof $readyComponentsRulesByRuleName>>('setReadyComponentsRulesByRuleNameEvent')
    const removeReadyComponentsRulesEvent = createEvent<Set<EntityId>>('removeReadyComponentsRulesEvent')
    const removeReadyComponentsRulesByRuleNameEvent = createEvent<Set<EntityId>>('removeReadyComponentsRulesByRuleNameEvent')

    const setReadyGroupRulesEvent = createEvent<UnitValue<typeof $readyGroupsRules>>('setReadyGroupRulesEvent')
    const setReadyGroupRulesByRuleNameEvent = createEvent<UnitValue<typeof $readyGroupsByRuleName>>('setReadyGroupRulesByRuleNameEvent')
    const removeReadyGroupRulesEvent = createEvent<Set<EntityId>>('removeReadyGroupRulesEvent')
    const removeReadyGroupRulesByRuleNameEvent = createEvent<Set<EntityId>>('removeReadyGroupRulesByRuleNameEvent')

    $readyComponentsRules.on(setReadyComponentsRulesEvent, (_, readyRules) => readyRules)
    $readyComponentsRulesByRuleName.on(setReadyComponentsRulesByRuleNameEvent, (_, readyRules) => readyRules)

    $readyComponentsRules.on(removeReadyComponentsRulesEvent, removeReadyValidationRules)
    $readyComponentsRulesByRuleName.on(removeReadyComponentsRulesByRuleNameEvent, (curReadyRules, rulesIdsToRemove) => {
        const result = Object.entries(curReadyRules).reduce<UnitValue<typeof $readyComponentsRulesByRuleName>>((curRedyRules, [componentId, readyRules]) => {
            const updatedReadyRules = removeReadyValidationRules(readyRules, rulesIdsToRemove)
            if (isEmpty(updatedReadyRules)) {
                delete curRedyRules[componentId]
            } else {
                curRedyRules[componentId] = updatedReadyRules
            }
            return curReadyRules
        }, {})
        return { ...result }
    })

    $readyGroupsRules.on(setReadyGroupRulesEvent, (_, readyRules) => readyRules)
    $readyGroupsByRuleName.on(setReadyGroupRulesByRuleNameEvent, (_, readyRules) => readyRules)

    $readyGroupsRules.on(removeReadyGroupRulesEvent, differenceSet)
    $readyGroupsByRuleName.on(removeReadyGroupRulesByRuleNameEvent, removeReadyValidationRules)

    const resultOfCalcReadyRulesEvent = sample({
        source: {
            validationRuleSchemas: schemaService.$componentsValidationSchemas,
            groupValidationSchemas: schemaService.$groupValidationSchemas,
            operatorsForConditions: themeService.$operatorsForConditions,
            depsComponentsRuleSchemas: depsOfRulesModel.$depsComponentsRuleSchemas,
            depsGroupsValidationRuleSchemas: depsOfRulesModel.$depsGroupsValidationRuleSchemas,
            readyComponentsRules: $readyComponentsRules,
            readyComponentsRulesByRuleName: $readyComponentsRulesByRuleName,
            readyComponentsRulesIds: $readyComponentsRulesIds,
            readyGroupsRules: $readyGroupsRules,
            readyGroupsByRuleName: $readyGroupsByRuleName,
            componentsSchemas: componentsModel.$componentsSchemas,
            getExecutorContextBuilder: componentsModel.$getExecutorContextBuilder,
        },
        clock: calcReadyRulesEvent,
        fn: (
            {
                validationRuleSchemas,
                groupValidationSchemas,
                depsComponentsRuleSchemas,
                depsGroupsValidationRuleSchemas,
                operatorsForConditions,
                readyComponentsRules,
                readyComponentsRulesByRuleName,
                readyComponentsRulesIds,
                readyGroupsRules,
                readyGroupsByRuleName,
                componentsSchemas,
                getExecutorContextBuilder,
            },
            { componentsSchemasToUpdate, skipIfValueUnchanged = true },
        ) => {
            const newComponentsSchemas = merge(cloneDeep(componentsSchemas), componentsSchemasToUpdate)

            const executorContext = getExecutorContextBuilder({ componentsSchemas: newComponentsSchemas })

            const readyRules = cloneDeep(readyComponentsRules)
            const readyRulesByRuleName = cloneDeep(readyComponentsRulesByRuleName)

            const readyGroupRules = cloneDeep(readyGroupsRules)
            const readyGroupRulesByRuleName = cloneDeep(readyGroupsByRuleName)

            const rulesToInactive: Set<EntityId> = new Set()

            const canBeContinueValidation = (componentId: EntityId, componentSchema: ComponentSchema) => {
                const oldValue = componentsSchemas[componentId].properties.value
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

                const dependentsValidations = depsComponentsRuleSchemas.validations.schemaIdToDependents[componentId]
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

                    const isReadyRuleNow = readyComponentsRulesIds.has(validationSchemaId)
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

                const dependentsValidations = depsGroupsValidationRuleSchemas.schemaIdToDependents[componentId]
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

                    const isReadyRuleNow = readyGroupsRules.has(validationSchemaId)
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
        clock: resultOfCalcReadyRulesEvent,
        filter: ({ readyRules }) => isNotEmpty(readyRules),
        fn: ({ readyRules }) => readyRules,
        target: setReadyComponentsRulesEvent,
    })

    sample({
        clock: resultOfCalcReadyRulesEvent,
        filter: ({ readyRulesByRuleName }) => isNotEmpty(readyRulesByRuleName),
        fn: ({ readyRulesByRuleName }) => readyRulesByRuleName,
        target: setReadyComponentsRulesByRuleNameEvent,
    })

    sample({
        clock: resultOfCalcReadyRulesEvent,
        filter: ({ readyGroupRules }) => isNotEmpty(readyGroupRules),
        fn: ({ readyGroupRules }) => readyGroupRules,
        target: setReadyGroupRulesEvent,
    })

    sample({
        clock: resultOfCalcReadyRulesEvent,
        filter: ({ readyGroupRulesByRuleName }) => isNotEmpty(readyGroupRulesByRuleName),
        fn: ({ readyGroupRulesByRuleName }) => readyGroupRulesByRuleName,
        target: setReadyGroupRulesByRuleNameEvent,
    })

    return {
        calcReadyRulesEvent,
        resultOfCalcReadyRulesEvent,
        $readyComponentsRules,
        $readyComponentsRulesByRuleName,
        $readyGroupsRules,
        $readyGroupsByRuleName,
    }
}
