import {
    ComponentsModels,
    ComponentsSchemas,
    ComponentsValidationErrorsModel,
    EntityId,
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
    const baseAddComponentsFx = createEffect<
        {
            componentsSchemas: ComponentsSchemas
            componentsModels: ComponentsModels
        },
        ComponentsModels
    >(({ componentsSchemas, componentsModels }) => {
        const newModels = Object.entries(componentsSchemas).reduce<ComponentsModels>((map, [componentId, componentSchema]) => {
            const model = createComponentModel({
                ...params,
                schema: componentSchema,
            })
            map.set(componentId, model)
            return map
        }, new Map(componentsModels))

        return Promise.resolve(newModels)
    })
    const addComponentsFx = attach({
        source: params.componentsRegistryModel.$componentsModels,
        mapParams: (componentsSchemas: ComponentsSchemas, componentsModels: ComponentsModels) => ({
            componentsSchemas,
            componentsModels,
        }),
        effect: baseAddComponentsFx,
    })

    const baseRemoveComponentsFx = createEffect<
        {
            ids: Set<EntityId>
            componentsModels: ComponentsModels
        },
        ComponentsModels
    >(({ componentsModels }) => {
        // TODO impl removing
        return Promise.resolve(componentsModels)
    })
    const removeComponentsFx = attach({
        source: params.componentsRegistryModel.$componentsModels,
        mapParams: (ids: Set<EntityId>, componentsModels: ComponentsModels) => ({
            ids,
            componentsModels,
        }),
        effect: baseRemoveComponentsFx,
    })

    return {
        addComponentsFx,
        removeComponentsFx,
    }
}
