import { EditableComponentProperties, UploaderComponentProperties } from '@form-crafter/core'

import { GroupOptionsBuilder, isGroupOptionsBuilder } from '../../../options-builder'
import { MutationRule, MutationRuleWithoutOptions } from '../types'

export const isMutationRuleWithOptions = (
    rule:
        | MutationRule<EditableComponentProperties>
        | MutationRuleWithoutOptions<EditableComponentProperties>
        | MutationRule<UploaderComponentProperties>
        | MutationRuleWithoutOptions<UploaderComponentProperties>,
): rule is MutationRule<EditableComponentProperties> | MutationRule<UploaderComponentProperties> => 'optionsBuilder' in rule

export const isMutationRuleWithGroupOptions = (
    rule:
        | MutationRule<EditableComponentProperties, any>
        | MutationRuleWithoutOptions<EditableComponentProperties>
        | MutationRule<UploaderComponentProperties, any>
        | MutationRuleWithoutOptions<UploaderComponentProperties>,
): rule is MutationRule<EditableComponentProperties, GroupOptionsBuilder> | MutationRule<UploaderComponentProperties, GroupOptionsBuilder> =>
    isMutationRuleWithOptions(rule) && isGroupOptionsBuilder(rule.optionsBuilder)
