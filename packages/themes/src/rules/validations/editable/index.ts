import { isEmailRule } from './is-email'
import { isRequiredRule } from './is-required'
import { maxDateRule } from './max-date'
import { maxLengthRule } from './max-length'
import { maxNumberRule } from './max-number'
import { minDateRule } from './min-date'
import { minLengthRule } from './min-length'
import { minNumberRule } from './min-number'

export const editable = {
    isRequiredRule,
    maxLengthRule,
    minLengthRule,
    maxDateRule,
    minDateRule,
    isEmailRule,
    minNumberRule,
    maxNumberRule,
}
