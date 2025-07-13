import { OptionalSerializableValue } from '@form-crafter/utils'

import { ComponentValidationRule, EditableValidationRule } from '../types'

export const isEditableValidationRule = <T extends OptionalSerializableValue = OptionalSerializableValue>(
    rule: ComponentValidationRule<T>,
): rule is EditableValidationRule<T> => rule.type === 'editable'
