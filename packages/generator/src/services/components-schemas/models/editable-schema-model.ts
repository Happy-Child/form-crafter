import { EditableComponentProperties, EditableComponentSchema } from '@form-crafter/core'
import { OptionalSerializableObject } from '@form-crafter/utils'
import { createEvent, createStore, EventCallable, sample } from 'effector'

import { EditableSchemaModel } from '../../../types'
import { CalcRelationsRulesPayload } from '../types'

export type EditableSchemaModelParams = {
    schema: EditableComponentSchema
    calcRelationsRulesEvent: EventCallable<CalcRelationsRulesPayload>
}

export const editableSchemaModel = ({ schema, calcRelationsRulesEvent }: EditableSchemaModelParams): EditableSchemaModel => {
    const $model = createStore<EditableComponentSchema>(schema)

    const setPropertiesEvent = createEvent<Partial<EditableComponentProperties>>('setPropertiesEvent')
    const updatePropertiesEvent = createEvent<Partial<EditableComponentProperties>>('updatePropertiesEvent')
    const setModelEvent = createEvent<OptionalSerializableObject>('setModelEvent')

    $model.on(setModelEvent, (schema, newSchema) => ({
        ...schema,
        ...newSchema,
    }))

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

    return { $model, setModelEvent, onUpdatePropertiesEvent: updatePropertiesEvent, onSetPropertiesEvent: setPropertiesEvent }
}
