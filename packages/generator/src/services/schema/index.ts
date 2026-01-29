import { ComponentsSchemas, Schema, SchemaLayout } from '@form-crafter/core'
import { createStore } from 'effector'
import { readonly } from 'patronum'

import { getDefaultSchemaLayout } from '../../consts'
import { init } from './init'
import { GroupValidationRuleSchemas, SchemaServiceParams } from './types'

const defaultSchemaLayout = getDefaultSchemaLayout()

const getLayout = (layout: Schema['layout']): Required<SchemaLayout> => ({
    rowsSpanPx: layout?.rowsSpanPx || defaultSchemaLayout.rowsSpanPx,
    colsSpanPx: layout?.colsSpanPx || defaultSchemaLayout.colsSpanPx,
})

export type { GroupValidationRuleSchemas }

export type SchemaService = ReturnType<typeof createSchemaService>

export const createSchemaService = ({ schema }: SchemaServiceParams) => {
    const $initialSchema = readonly(createStore<Schema>(schema))

    const $layout = readonly(createStore<Required<SchemaLayout>>(getLayout(schema.layout)))

    const $initialComponentsSchemas = readonly(createStore<ComponentsSchemas>(schema.componentsSchemas))

    const $additionalTriggers = readonly($initialSchema.map((schema) => schema.validations?.additionalTriggers || []))

    const $groupValidationSchemas = readonly(
        $initialSchema.map((schema) =>
            (schema.validations?.schemas || []).reduce<GroupValidationRuleSchemas>((map, schema) => {
                map[schema.id] = schema
                return map
            }, {}),
        ),
    )

    init({})

    return {
        $initialSchema,
        $layout,
        $initialComponentsSchemas,
        $additionalTriggers,
        $groupValidationSchemas,
    }
}
