import { ComponentType } from '@form-crafter/core'

import { ContainerSchemaFactory } from './container-schema-factory'
import { EditableSchemaFactory } from './editable-schema-factory'
import { RepeaterSchemaFactory } from './repeater-schema-factory'
import { StaticSchemaFactory } from './static-schema-factory'
import { UploaderSchemaFactory } from './uploader-schema-factory'

export type ComponentSchemaFactory = EditableSchemaFactory | ContainerSchemaFactory | RepeaterSchemaFactory | UploaderSchemaFactory | StaticSchemaFactory

export type ComponentSchemaFactoryByType<T extends ComponentType> = T extends 'editable'
    ? EditableSchemaFactory
    : T extends 'container'
      ? ContainerSchemaFactory
      : T extends 'repeater'
        ? RepeaterSchemaFactory
        : T extends 'uploader'
          ? UploaderSchemaFactory
          : T extends 'static'
            ? StaticSchemaFactory
            : never
