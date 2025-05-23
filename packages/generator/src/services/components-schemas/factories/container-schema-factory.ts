import { ContainerComponentProperties, ContainerComponentSchema } from '@form-crafter/core'
import { createEvent, createStore, EventCallable, StoreWritable } from 'effector'

export type ContainerSchemaFactoryParams = {
    schema: ContainerComponentSchema
}

export type ContainerSchemaFactory = {
    $schema: StoreWritable<ContainerComponentSchema>
    onUpdatePropertiesEvent: EventCallable<Partial<ContainerComponentProperties>>
}

export const containerSchemaFactory = ({ schema }: ContainerSchemaFactoryParams): ContainerSchemaFactory => {
    const $schema = createStore<ContainerComponentSchema>(schema)
    const updatePropertiesEvent = createEvent<Partial<ContainerComponentProperties>>('updatePropertiesEvent')

    $schema.on(updatePropertiesEvent, (schema, newProperties) => ({
        ...schema,
        properties: {
            ...schema.properties,
            ...newProperties,
        },
    }))

    return { $schema, onUpdatePropertiesEvent: updatePropertiesEvent }
}
