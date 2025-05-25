import { EditableComponentProperties, EditableComponentSchema } from '@form-crafter/core'
import { createEvent, createStore, EventCallable, sample, StoreWritable } from 'effector'

import { CalcRelationsRulesPayload } from '../types'

export type EditableSchemaModelParams = {
    schema: EditableComponentSchema
    calcRelationsRulesEvent: EventCallable<CalcRelationsRulesPayload>
}

export type EditableSchemaModel = {
    $model: StoreWritable<EditableComponentSchema>
    onUpdatePropertiesEvent: EventCallable<Partial<EditableComponentProperties>>
    onSetPropertiesEvent: EventCallable<Partial<EditableComponentProperties>>
}

export const editableSchemaModel = ({ schema, calcRelationsRulesEvent }: EditableSchemaModelParams): EditableSchemaModel => {
    const $model = createStore<EditableComponentSchema>(schema)

    const setPropertiesEvent = createEvent<Partial<EditableComponentProperties>>('setPropertiesEvent')
    const updatePropertiesEvent = createEvent<Partial<EditableComponentProperties>>('updatePropertiesEvent')

    $model.on(setPropertiesEvent, (schema, newProperties) => ({
        ...schema,
        properties: {
            ...schema.properties,
            ...newProperties,
        },
    }))

    sample({
        source: $model,
        clock: updatePropertiesEvent,
        fn: ({ meta }, data) => ({ id: meta.id, data }),
        target: calcRelationsRulesEvent,
    })

    // триггер валидации один на всю форму
    // on blur event
    // слушать updatePropertiesEvent, если меняем value то вызывать другой ивент и начинать валидацию

    return { $model, onUpdatePropertiesEvent: updatePropertiesEvent, onSetPropertiesEvent: setPropertiesEvent }
}
