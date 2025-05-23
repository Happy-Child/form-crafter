import {
    ComponentSchema,
    isContainerComponentSchema,
    isEditableComponentSchema,
    isRepeaterComponentSchema,
    isUploaderComponentSchema,
} from '@form-crafter/core'

import { containerSchemaFactory } from './container-schema-factory'
import { editableSchemaFactory } from './editable-schema-factory'
import { repeaterSchemaFactory } from './repeater-schema-factory'
import { staticSchemaFactory } from './static-schema-factory'
import { ComponentSchemaFactory } from './types'
import { uploaderSchemaFactory } from './uploader-schema-factory'

export type ComponentSchemaFactoryParams = {
    schema: ComponentSchema
}

export const componentSchemaFactory = ({ schema }: ComponentSchemaFactoryParams): ComponentSchemaFactory => {
    if (isEditableComponentSchema(schema)) {
        return editableSchemaFactory({ schema })
    }

    if (isContainerComponentSchema(schema)) {
        return containerSchemaFactory({ schema })
    }

    if (isRepeaterComponentSchema(schema)) {
        return repeaterSchemaFactory({ schema })
    }

    if (isUploaderComponentSchema(schema)) {
        return uploaderSchemaFactory({ schema })
    }

    return staticSchemaFactory({ schema })
}
