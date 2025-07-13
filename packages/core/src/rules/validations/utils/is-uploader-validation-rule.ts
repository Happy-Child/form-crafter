import { OptionalSerializableValue } from '@form-crafter/utils'

import { ComponentValidationRule, UploaderValidationRule } from '../types'

export const isUploaderValidationRule = <T extends OptionalSerializableValue = OptionalSerializableValue>(
    rule: ComponentValidationRule<T>,
): rule is UploaderValidationRule<T> => rule.type === 'uploader'
