import { isContainerComponentSchema, isEditableComponentSchema, isRepeaterComponentSchema, isUploaderComponentSchema } from '@form-crafter/core'

import { ComponentSchemaModel } from '../../../types'
import { createContainerSchemaModel } from './container-schema-model'
import { createEditableSchemaModel } from './editable-schema-model'
import { createRepeaterSchemaModel } from './repeater-schema-model'
import { createStaticSchemaModel } from './static-schema-model'
import { ComponentSchemaModelParams } from './types'
import { createUploaderSchemaModel } from './uploader-schema-model'

export const createComponentSchemaModel = ({ schema, ...args }: ComponentSchemaModelParams): ComponentSchemaModel => {
    if (isEditableComponentSchema(schema)) {
        return createEditableSchemaModel({ schema, ...args })
    }

    if (isContainerComponentSchema(schema)) {
        return createContainerSchemaModel({ schema, ...args })
    }

    if (isRepeaterComponentSchema(schema)) {
        return createRepeaterSchemaModel({ schema, ...args })
    }

    if (isUploaderComponentSchema(schema)) {
        return createUploaderSchemaModel({ schema, ...args })
    }

    return createStaticSchemaModel({ schema, ...args })
}
