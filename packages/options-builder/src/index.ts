import { checkbox } from './builders/checkbox'
import { date } from './builders/date'
import { datePicker } from './builders/date-picker'
import { dateRange } from './builders/date-range'
import { group } from './builders/group'
import { input } from './builders/input'
import { mask } from './builders/mask'
import { miltiCheckbox } from './builders/multi-checkbox'
import { multiSelect } from './builders/multi-select'
import { multifield } from './builders/multifield'
import { number } from './builders/number'
import { radio } from './builders/radio'
import { select } from './builders/select'
import { slider } from './builders/slider'
import { textarea } from './builders/textarea'
import { time } from './builders/time'
import { timePicker } from './builders/time-picker'

export * from './relations'
export * from './types'
export * from './validations'

export const builders = {
    input,
    time,
    date,
    number,
    select,
    multiSelect,
    checkbox,
    miltiCheckbox,
    radio,
    slider,
    datePicker,
    dateRange,
    timePicker,
    mask,
    group,
    multifield,
    textarea,
}
