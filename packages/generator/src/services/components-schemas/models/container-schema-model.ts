import { ContainerComponentProperties, ContainerComponentSchema } from '@form-crafter/core'
import { createEvent, createStore, EventCallable, StoreWritable } from 'effector'

export type ContainerSchemaModelParams = {
    schema: ContainerComponentSchema
}

export type ContainerSchemaModel = {
    $model: StoreWritable<ContainerComponentSchema>
    onUpdatePropertiesEvent: EventCallable<Partial<ContainerComponentProperties>>
}

export const containerSchemaModel = ({ schema }: ContainerSchemaModelParams): ContainerSchemaModel => {
    const $model = createStore<ContainerComponentSchema>(schema)
    const updatePropertiesEvent = createEvent<Partial<ContainerComponentProperties>>('updatePropertiesEvent')

    $model.on(updatePropertiesEvent, (model, newProperties) => ({
        ...model,
        properties: {
            ...model.properties,
            ...newProperties,
        },
    }))

    return { $model, onUpdatePropertiesEvent: updatePropertiesEvent }
}
