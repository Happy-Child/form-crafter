import { ComponentType } from '@form-crafter/core'

import { ContainerSchemaModel } from './container-schema-model'
import { EditableSchemaModel } from './editable-schema-model'
import { RepeaterSchemaModel } from './repeater-schema-model'
import { StaticSchemaModel } from './static-schema-model'
import { UploaderSchemaModel } from './uploader-schema-model'

export type ComponentSchemaModel = EditableSchemaModel | ContainerSchemaModel | RepeaterSchemaModel | UploaderSchemaModel | StaticSchemaModel

export type ComponentSchemaModelByType<T extends ComponentType> = T extends 'editable'
    ? EditableSchemaModel
    : T extends 'container'
      ? ContainerSchemaModel
      : T extends 'repeater'
        ? RepeaterSchemaModel
        : T extends 'uploader'
          ? UploaderSchemaModel
          : T extends 'static'
            ? StaticSchemaModel
            : never
