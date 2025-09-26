import { ComponentsSchemas, ValidationRuleSchema } from '../components'
import { ComponentModule } from '../components'
import { GroupValidationRule } from '../rules'
import { ResponsiveSizes, ValidationsTriggers } from '../types'
import { Views } from '../views'

export type SchemaLayout = {
    rowsSpanPx?: ResponsiveSizes<number>
    colsSpanPx?: ResponsiveSizes<number>
}

export type Schema = {
    // TODO зачем?
    id: string
    layout?: SchemaLayout
    views: Views
    componentsSchemas: ComponentsSchemas
    validations?: {
        additionalTriggers?: ValidationsTriggers[]
        schemas?: ValidationRuleSchema[]
    }
}

export type FormCrafterTheme = {
    componentsModules: ComponentModule[]
    groupValidationRules?: GroupValidationRule[]
}
