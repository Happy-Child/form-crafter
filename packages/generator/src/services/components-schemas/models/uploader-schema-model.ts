import { UploaderComponentProperties, UploaderComponentSchema } from '@form-crafter/core'
import { createEvent, createStore, EventCallable, StoreWritable } from 'effector'

export type UploaderSchemaModelParams = {
    schema: UploaderComponentSchema
}

export type UploaderSchemaModel = {
    $model: StoreWritable<UploaderComponentSchema>
    onUpdatePropertiesEvent: EventCallable<Partial<UploaderComponentProperties>>
}

export const uploaderSchemaModel = ({ schema }: UploaderSchemaModelParams): UploaderSchemaModel => {
    const $model = createStore<UploaderComponentSchema>(schema)
    const updatePropertiesEvent = createEvent<Partial<UploaderComponentProperties>>('onUpdatePropertiesEvent')

    $model.on(updatePropertiesEvent, (model, newProperties) => ({
        ...model,
        properties: {
            ...model.properties,
            ...newProperties,
        },
    }))

    return { $model, onUpdatePropertiesEvent: updatePropertiesEvent }
}
