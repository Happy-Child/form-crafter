import { ComponentsSchemas } from '../../components'
import { ValidationRuleParams } from '../../rules'
import { ResponsiveSizes } from '../../types'
import { Views } from '../../views'

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
    validations?: {
        validateOn?: 'onSubmit' | 'onChange' | 'onBlur'
        params: ValidationRuleParams[]
    }
}
