import { EditableComponentProperties, EditableComponentSchema } from '@form-crafter/core'
import { createEvent, createStore, EventCallable, StoreWritable } from 'effector'

export type EditableSchemaFactoryParams = {
    schema: EditableComponentSchema
}

export type EditableSchemaFactory = {
    $schema: StoreWritable<EditableComponentSchema>
    onUpdatePropertiesEvent: EventCallable<Partial<EditableComponentProperties>>
}

export const editableSchemaFactory = ({ schema }: EditableSchemaFactoryParams): EditableSchemaFactory => {
    const $schema = createStore<EditableComponentSchema>(schema)
    const updatePropertiesEvent = createEvent<Partial<EditableComponentProperties>>('updatePropertiesEvent')

    $schema.on(updatePropertiesEvent, (schema, newProperties) => ({
        ...schema,
        properties: {
            ...schema.properties,
            ...newProperties,
        },
    }))

    // триггер валидации один на всю форму
    // on blue event
    // слушать updatePropertiesEvent, если меняем value то вызывать другой ивент и начинать валидацию

    // rename factory -> model

    return { $schema, onUpdatePropertiesEvent: updatePropertiesEvent }
}
