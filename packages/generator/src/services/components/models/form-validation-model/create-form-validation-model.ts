import {
    ComponentsValidationErrorsModel,
    EntityId,
    ReadyConditionalValidationsModel,
    RunComponentValidationFxDone,
    RunComponentValidationFxFail,
} from '@form-crafter/core'
import { isEmpty, isNotEmpty, splitAllSettledResult } from '@form-crafter/utils'
import { attach, combine, createEffect, createStore, UnitValue } from 'effector'

import { SchemaService } from '../../../schema'
import { ThemeService } from '../../../theme'
import { isValidableModel } from '../component-model/variants'
import { ComponentsRegistryModel } from '../components-registry-model'
import { createGroupValidationModel } from './models/group-validation-model'

type Params = {
    themeService: ThemeService
    schemaService: SchemaService
    componentsRegistryModel: ComponentsRegistryModel
    componentsValidationErrorsModel: ComponentsValidationErrorsModel
    readyConditionalValidationsModel: ReadyConditionalValidationsModel
}

export type FormValidationModel = ReturnType<typeof createFormValidationModel>

export const createFormValidationModel = ({
    themeService,
    schemaService,
    componentsRegistryModel,
    componentsValidationErrorsModel,
    readyConditionalValidationsModel,
}: Params) => {
    const $isComponentsValidationPending = createStore<boolean>(false)

    const $componentsIdsCanBeValidate = combine(componentsRegistryModel.$currentViewVisibleComponentsSchemas, (currentViewVisibleComponentsSchemas) =>
        Object.entries(currentViewVisibleComponentsSchemas).reduce<Set<EntityId>>((result, [componentId, schema]) => {
            if (isNotEmpty(schema.validations?.schemas)) {
                result.add(componentId)
            }
            return result
        }, new Set()),
    )

    const baseRunComponentsValidationsFx = createEffect<
        {
            componentsModels: UnitValue<typeof componentsRegistryModel.$componentsModels>
            componentsIdsCanBeValidate: UnitValue<typeof $componentsIdsCanBeValidate>
        },
        RunComponentValidationFxDone[],
        RunComponentValidationFxFail[]
    >(async ({ componentsModels, componentsIdsCanBeValidate }) => {
        const tasks = []

        for (const componentId of componentsIdsCanBeValidate) {
            const model = componentsModels.get(componentId)
            if (isNotEmpty(model) && isValidableModel(model)) {
                tasks.push(model.runValidationFx())
            }
        }

        const [resolved, rejected] = await splitAllSettledResult<RunComponentValidationFxDone, RunComponentValidationFxFail>(tasks)
        if (isNotEmpty(rejected)) {
            return Promise.reject(rejected)
        }

        return Promise.resolve(resolved)
    })
    const runComponentsValidationsFx = attach({
        source: { componentsModels: componentsRegistryModel.$componentsModels, componentsIdsCanBeValidate: $componentsIdsCanBeValidate },
        effect: baseRunComponentsValidationsFx,
    })

    const groupValidationModel = createGroupValidationModel({
        themeService,
        schemaService,
        componentsRegistryModel,
        componentsValidationErrorsModel,
        readyConditionalValidationsModel,
    })

    const $groupValidationErrors = combine(groupValidationModel.$errors, (groupValidationErrors) => Array.from(groupValidationErrors.values()))

    const $formIsValid = combine(
        componentsValidationErrorsModel.$visibleErrors,
        groupValidationModel.$errors,
        (visibleValidationErrors, groupValidationErrors) => isEmpty(visibleValidationErrors) && isEmpty(groupValidationErrors),
    )

    const $isValidationPending = combine(
        groupValidationModel.$isValidationPending,
        $isComponentsValidationPending,
        (groupsValidationPending, componentsValidationPending) => groupsValidationPending || componentsValidationPending,
    )

    $isComponentsValidationPending.on(runComponentsValidationsFx, () => true)
    $isComponentsValidationPending.on(runComponentsValidationsFx.finally, () => false)

    const runFormValidationFx = createEffect(async () => {
        let someoneFailed = false

        try {
            await runComponentsValidationsFx()
        } catch {
            someoneFailed = true
        }

        try {
            await groupValidationModel.runValidationsFx()
        } catch {
            someoneFailed = true
        }

        if (someoneFailed) {
            return Promise.reject()
        }

        return Promise.resolve()
    })

    return {
        groupValidationModel,
        runFormValidationFx,
        $formIsValid,
        $isValidationPending,
        $groupValidationErrors,
    }
}
