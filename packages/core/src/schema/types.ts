import { ComponentsSchemas, ValidationRuleSchema } from '../components'
import { ComponentModule } from '../components-modules'
import { FormValidationRule } from '../rules'
import { ResponsiveSizes, ValidationsTriggers } from '../types'
import { Views } from '../views'

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
        additionalTriggers?: ValidationsTriggers[]
        options?: ValidationRuleSchema[]
    }
}

export type FormCrafterTheme = {
    componentsModules: ComponentModule[]
    formValidationsRules?: FormValidationRule[]
}
