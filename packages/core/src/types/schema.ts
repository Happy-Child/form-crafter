import { ComponentsSchemas } from './components-schemas'
import { ResponsiveSizes } from './general'
import { Views } from './views'

export type SchemaLayout = {
    rowsSpanPx?: ResponsiveSizes<number>
    colsSpanPx?: ResponsiveSizes<number>
}

export type Schema = {
    id: string
    version: string
    layout?: SchemaLayout
    views: Views
    componentsSchemas: ComponentsSchemas
    validationsRules: any[]
    // validations: {
    //     validateOn?: 'onSubmit' | 'onChange' | 'onBlur'
    //     rules: { conditions: ...3система описания логич. выражений }[]
    // }
    relationsRules: any[]
}
