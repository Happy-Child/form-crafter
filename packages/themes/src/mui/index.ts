import { ComponentModule } from '@form-crafter/core'

import { buttonModule } from './Button'
import { checkboxModule } from './Checkbox'
import { dateInputModule } from './DateInput'
import { emailModule } from './Email'
import { groupModule } from './Group'
import { inputModule } from './Input'
import { multifieldModule } from './Multifield'
import { numberInputModule } from './NumberInput'
import { radioModule } from './Radio'
import { selectModule } from './Select'
import { textModule } from './Text'
import { textareaModule } from './Textarea'
import { timeInputModule } from './TimeInput'

export const muiTheme = [
    buttonModule,
    checkboxModule,
    dateInputModule,
    emailModule,
    groupModule,
    inputModule,
    numberInputModule,
    multifieldModule,
    radioModule,
    selectModule,
    textModule,
    textareaModule,
    timeInputModule,
] as ComponentModule[]
