import { FormCrafterTheme } from '@form-crafter/core'

import { rules } from '../rules'
import { buttonModule } from './Button'
import { checkboxModule } from './Checkbox'
import { dateFieldModule } from './DateField'
import { emailModule } from './Email'
import { groupModule } from './Group'
import { multifieldModule } from './Multifield'
import { numberFieldModule } from './NumberField'
import { radioModule } from './Radio'
import { selectModule } from './Select'
import { textModule } from './Text'
import { textareaModule } from './Textarea'
import { textFieldModule } from './TextField'
import { timeFieldModule } from './TimeField'

export const muiTheme: FormCrafterTheme = {
    componentsModules: [
        buttonModule,
        checkboxModule,
        dateFieldModule,
        emailModule,
        groupModule,
        textFieldModule,
        numberFieldModule,
        multifieldModule,
        radioModule,
        selectModule,
        textModule,
        textareaModule,
        timeFieldModule,
    ],
    groupValidationRules: [rules.validations.group.oneOfNotEmptyRule],
}
