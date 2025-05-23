import { UploaderComponentProperties, UploaderComponentSchema } from '@form-crafter/core'
import { createEvent, createStore, EventCallable, StoreWritable } from 'effector'

export type UploaderSchemaFactoryParams = {
    schema: UploaderComponentSchema
}

export type UploaderSchemaFactory = {
    $schema: StoreWritable<UploaderComponentSchema>
    onUpdatePropertiesEvent: EventCallable<Partial<UploaderComponentProperties>>
}

export const uploaderSchemaFactory = ({ schema }: UploaderSchemaFactoryParams): UploaderSchemaFactory => {
    const $schema = createStore<UploaderComponentSchema>(schema)
    const updatePropertiesEvent = createEvent<Partial<UploaderComponentProperties>>('onUpdatePropertiesEvent')

    $schema.on(updatePropertiesEvent, (schema, newProperties) => ({
        ...schema,
        properties: {
            ...schema.properties,
            ...newProperties,
        },
    }))

    return { $schema, onUpdatePropertiesEvent: updatePropertiesEvent }
}
