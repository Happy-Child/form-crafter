import { ContainerComponent, EditableComponent, RepeaterComponent, StaticComponent, UploaderComponent } from '../components/generator'
import { ComponentConditionOperator, ComponentConditionOperatorWithoutOptions } from '../components-operators'
import { GroupOptionsBuilder, OptionsBuilderOutput } from '../options-builder'
import {
    EditableValidationRule,
    EditableValidationRuleWithoutOptions,
    RelationRule,
    RelationRuleWithoutOptions,
    RepeaterValidationRule,
    RepeaterValidationRuleWithoutOptions,
    UploaderValidationRule,
    UploaderValidationRuleWithoutOptions,
} from '../rules'
import {
    ContainerComponentProperties,
    EditableComponentProperties,
    RepeaterComponentProperties,
    StaticComponentProperties,
    UploaderComponentProperties,
} from '../types'

type GeneralComponentModule<O extends GroupOptionsBuilder> = {
    name: string
    label: string
    optionsBuilder: O
}

export type EditableComponentModule<O extends GroupOptionsBuilder<EditableComponentProperties>> = GeneralComponentModule<O> & {
    operatorsForConditions?: (ComponentConditionOperator<any> | ComponentConditionOperatorWithoutOptions)[]
    validationsRules?: (
        | EditableValidationRule<OptionsBuilderOutput<O>['value'], any>
        | EditableValidationRuleWithoutOptions<OptionsBuilderOutput<O>['value']>
    )[]
    relationsRules?: (RelationRule<EditableComponentProperties, any> | RelationRuleWithoutOptions<EditableComponentProperties>)[]
    Component: EditableComponent<OptionsBuilderOutput<O>>
}

export type ContainerComponentModule<O extends GroupOptionsBuilder<ContainerComponentProperties>> = GeneralComponentModule<O> & {
    Component: ContainerComponent<OptionsBuilderOutput<O>>
}

export type RepeaterComponentModule<O extends GroupOptionsBuilder<RepeaterComponentProperties>> = GeneralComponentModule<O> & {
    operatorsForConditions?: (ComponentConditionOperator<any> | ComponentConditionOperatorWithoutOptions)[]
    validationsRules?: (RepeaterValidationRule<any> | RepeaterValidationRuleWithoutOptions)[]
    relationsRules?: (RelationRule<RepeaterComponentProperties, any> | RelationRuleWithoutOptions<RepeaterComponentProperties>)[]
    Component: RepeaterComponent<OptionsBuilderOutput<O>>
}

export type UploaderComponentModule<O extends GroupOptionsBuilder<UploaderComponentProperties>> = GeneralComponentModule<O> & {
    operatorsForConditions?: (ComponentConditionOperator<any> | ComponentConditionOperatorWithoutOptions)[]
    relationsRules?: (RelationRule<UploaderComponentProperties, any> | RelationRuleWithoutOptions<UploaderComponentProperties>)[]
    validationsRules?: (UploaderValidationRule<any> | UploaderValidationRuleWithoutOptions<any>)[]
    Component: UploaderComponent<OptionsBuilderOutput<O>>
}

export type StaticComponentModule<O extends GroupOptionsBuilder<StaticComponentProperties>> = GeneralComponentModule<O> & {
    relationsRules?: (RelationRule<StaticComponentProperties, any> | RelationRuleWithoutOptions<StaticComponentProperties>)[]
    Component: StaticComponent<OptionsBuilderOutput<O>>
}

export type ComponentModule =
    | EditableComponentModule<GroupOptionsBuilder<EditableComponentProperties>>
    | ContainerComponentModule<GroupOptionsBuilder<ContainerComponentProperties>>
    | RepeaterComponentModule<GroupOptionsBuilder<RepeaterComponentProperties>>
    | UploaderComponentModule<GroupOptionsBuilder<UploaderComponentProperties>>
    | StaticComponentModule<GroupOptionsBuilder<StaticComponentProperties>>
