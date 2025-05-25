import {
    ComponentSchema,
    isContainerComponentSchema,
    isEditableComponentSchema,
    isRepeaterComponentSchema,
    isUploaderComponentSchema,
} from '@form-crafter/core'
import { EventCallable } from 'effector'

import { CalcRelationsRulesPayload } from '../types'
import { containerSchemaModel } from './container-schema-model'
import { editableSchemaModel } from './editable-schema-model'
import { repeaterSchemaModel } from './repeater-schema-model'
import { staticSchemaModel } from './static-schema-model'
import { ComponentSchemaModel } from './types'
import { uploaderSchemaModel } from './uploader-schema-model'

export type ComponentSchemaModelParams = {
    schema: ComponentSchema
    calcRelationsRulesEvent: EventCallable<CalcRelationsRulesPayload>
}

export const componentSchemaModel = ({ schema, ...args }: ComponentSchemaModelParams): ComponentSchemaModel => {
    if (isEditableComponentSchema(schema)) {
        return editableSchemaModel({ schema, ...args })
    }

    if (isContainerComponentSchema(schema)) {
        return containerSchemaModel({ schema, ...args })
    }

    if (isRepeaterComponentSchema(schema)) {
        return repeaterSchemaModel({ schema, ...args })
    }

    if (isUploaderComponentSchema(schema)) {
        return uploaderSchemaModel({ schema, ...args })
    }

    return staticSchemaModel({ schema, ...args })
}
