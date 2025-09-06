import { FormCrafterTheme } from '@form-crafter/core'

import { rules } from '../rules'
import { buttonModule } from './Button'
import { checkboxModule } from './Checkbox'
import { dateInputModule } from './DateInput'
import { datePickerModule } from './DatePicker'
import { dateRangeModule } from './DateRange'
import { groupModule } from './Group'
import { multifieldModule } from './Multifield'
import { numberInputModule } from './NumberInput'
import { radioModule } from './Radio'
import { selectModule } from './Select'
import { textModule } from './Text'
import { textareaModule } from './Textarea'
import { textInputModule } from './TextInput'
import { timeInputModule } from './TimeInput'

export const muiTheme: FormCrafterTheme = {
    componentsModules: [
        buttonModule,
        checkboxModule,
        dateInputModule,
        datePickerModule,
        dateRangeModule,
        groupModule,
        textInputModule,
        numberInputModule,
        multifieldModule,
        radioModule,
        selectModule,
        textModule,
        textareaModule,
        timeInputModule,
    ],
    groupValidationRules: [rules.validations.groups.oneOfNotEmptyRule],
}
