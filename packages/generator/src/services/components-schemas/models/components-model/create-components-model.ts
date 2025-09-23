import { isNotEmpty } from '@form-crafter/utils'
import { attach, combine, createEffect, createEvent, createStore, sample, UnitValue } from 'effector'

import { isConditionSuccessful } from '../../../../utils'
import { ThemeService } from '../../../theme'
import { ComponentToUpdate, GetExecutorContextBuilder, GetIsConditionSuccessfulChecker } from './types'
import { ComponentsModels } from './types'
import { buildExecutorContext, extractComponentsModels } from './utils'

type Params = {
    themeService: ThemeService
}

export type ComponentsModel = ReturnType<typeof createComponentsModel>

export const createComponentsModel = ({ themeService }: Params) => {
    const $models = createStore<ComponentsModels>(new Map())

    const $componentsSchemas = combine($models, extractComponentsModels)

    const $getExecutorContextBuilder: GetExecutorContextBuilder = combine<UnitValue<typeof $componentsSchemas>, UnitValue<GetExecutorContextBuilder>>(
        $componentsSchemas,
        (componentsSchemas) => {
            return (params) => buildExecutorContext({ componentsSchemas: params?.componentsSchemas || componentsSchemas })
        },
    )

    const $getIsConditionSuccessfulChecker: GetIsConditionSuccessfulChecker = combine(
        $getExecutorContextBuilder,
        themeService.$operators,
        (getExecutorContextBuilder, operators) => (params) => {
            const ctx = params?.ctx || getExecutorContextBuilder()
            return ({ condition }) => isConditionSuccessful({ ctx, condition, operators })
        },
    )

    const setModelsEvent = createEvent<ComponentsModels>('setModelsEvent')

    const baseUpdateModelsFx = createEffect<
        {
            componentsModels: ComponentsModels
            componentsToUpdate: ComponentToUpdate[]
        },
        ComponentsModels
    >(({ componentsModels, componentsToUpdate }) => {
        const newModel = componentsToUpdate.reduce((map, { componentId, schema, isNewValue }) => {
            const model = map.get(componentId)
            if (isNotEmpty(model)) {
                model.setSchemaEvent({ schema, isNewValue })
            }
            return map
        }, new Map(componentsModels))

        return Promise.resolve(newModel)
    })
    const updateModelsFx = attach({
        source: $models,
        mapParams: (componentsToUpdate: ComponentToUpdate[], componentsModels: ComponentsModels) => ({
            componentsModels,
            componentsToUpdate,
        }),
        effect: baseUpdateModelsFx,
    })

    $models.on(setModelsEvent, (_, data) => data)

    sample({
        clock: updateModelsFx.doneData,
        target: setModelsEvent,
    })

    return {
        updateModelsFx,
        initEvent: setModelsEvent,
        $models,
        $componentsSchemas,
        $getExecutorContextBuilder,
        $getIsConditionSuccessfulChecker,
    }
}
