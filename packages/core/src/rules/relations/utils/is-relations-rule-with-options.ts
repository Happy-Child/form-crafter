import { EditableComponentProperties, UploaderComponentProperties } from 'packages/core/src/types'

import { GroupOptionsBuilder, isGroupOptionsBuilder } from '../../../options-builder'
import { RelationRule, RelationRuleWithoutOptions } from '../types'

export const isRelationsRuleWithOptions = (
    rule:
        | RelationRule<EditableComponentProperties>
        | RelationRuleWithoutOptions<EditableComponentProperties>
        | RelationRule<UploaderComponentProperties>
        | RelationRuleWithoutOptions<UploaderComponentProperties>,
): rule is RelationRule<EditableComponentProperties> | RelationRule<UploaderComponentProperties> => 'optionsBuilder' in rule

export const isRelationsRuleWithGroupOptions = (
    rule:
        | RelationRule<EditableComponentProperties, any>
        | RelationRuleWithoutOptions<EditableComponentProperties>
        | RelationRule<UploaderComponentProperties, any>
        | RelationRuleWithoutOptions<UploaderComponentProperties>,
): rule is RelationRule<EditableComponentProperties, GroupOptionsBuilder> | RelationRule<UploaderComponentProperties, GroupOptionsBuilder> =>
    isRelationsRuleWithOptions(rule) && isGroupOptionsBuilder(rule.optionsBuilder)
