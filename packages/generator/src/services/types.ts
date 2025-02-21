import { Schema } from '@form-crafter/core'

import { ComponentsSchemasService } from './components-schemas'
import { DynamicContainerService } from './dynamic-container/types'
import { FormService } from './form/types'
import { SchemaService } from './schema'
import { ViewsService } from './views'

export type RootServicesParams = {
    schema: Schema
    onSubmit: (schema: Schema) => void
}

export type RootServices = {
    schemaService: SchemaService
    componentsSchemasService: ComponentsSchemasService
    viewsService: ViewsService
    formService: FormService
    dynamicContainerService: DynamicContainerService
}
