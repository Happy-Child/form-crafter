import { EditableComponentSchema } from '../components'
import { GroupOptionsBuilder, OptionsBuilderOutput } from '../options-builder'
import { ComponentConditionOperator, ComponentConditionOperatorToCreate, ConditionOperatorExecute } from './types'

export function createComponentConditionOperator<
    OptsBuilder,
    EnterValue,
    OptsBuilderOptions extends OptsBuilder extends GroupOptionsBuilder ? OptionsBuilderOutput<OptsBuilder> : never,
    CompSchema extends EditableComponentSchema,
    Execute extends ConditionOperatorExecute<OptsBuilder, EnterValue, OptsBuilderOptions, CompSchema> = ConditionOperatorExecute<
        OptsBuilder,
        EnterValue,
        OptsBuilderOptions,
        CompSchema
    >,
>(params: ComponentConditionOperatorToCreate<OptsBuilder, EnterValue, Execute>): ComponentConditionOperator {
    return params as ComponentConditionOperator
}
