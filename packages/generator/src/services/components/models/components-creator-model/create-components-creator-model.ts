import {
    ComponentsModels,
    ComponentsSchemas,
    ComponentsValidationErrorsModel,
    ReadyConditionalValidationsModel,
    RunMutationsOnUserActionPayload,
} from '@form-crafter/core'
import { attach, createEffect, EventCallable } from 'effector'

import { SchemaService } from '../../../schema'
import { ThemeService } from '../../../theme'
import { ViewsService } from '../../../views'
import { createComponentModel } from '../component-model'
import { ComponentsRegistryModel } from '../components-registry-model'

type Params = {
    runMutations: EventCallable<RunMutationsOnUserActionPayload>
    themeService: ThemeService
    schemaService: SchemaService
    viewsService: ViewsService
    componentsRegistryModel: ComponentsRegistryModel
    componentsValidationErrorsModel: ComponentsValidationErrorsModel
    readyConditionalValidationsModel: ReadyConditionalValidationsModel
}

export type ComponentsCreatorModel = ReturnType<typeof createComponentsCreatorModel>

export const createComponentsCreatorModel = (params: Params) => {
    const baseCreateComponentsFx = createEffect<
        {
            componentsSchemas: ComponentsSchemas
        },
        ComponentsModels
    >(({ componentsSchemas }) => {
        const newModels = Object.entries(componentsSchemas).reduce<ComponentsModels>((map, [componentId, componentSchema]) => {
            const model = createComponentModel({
                ...params,
                schema: componentSchema,
            })
            map.set(componentId, model)
            return map
        }, new Map())

        return Promise.resolve(newModels)
    })
    const createComponentsFx = attach({
        mapParams: (componentsSchemas: ComponentsSchemas) => ({
            componentsSchemas,
        }),
        effect: baseCreateComponentsFx,
    })

    return {
        createComponentsFx,
    }
}
