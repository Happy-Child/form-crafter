import { ComponentConditionOperator } from '../../../../components-operators'
import { GroupOptionsBuilder, OptionsBuilderOutput } from '../../../../options-builder'
import { ComponentValidationRule, MutationRule } from '../../../../rules'
import { GeneralComponentModule } from '../../../modules'
import { RepeaterComponent } from '../generator'
import { RepeaterComponentProperties } from '../schema'

export type RepeaterComponentModule<B extends GroupOptionsBuilder<RepeaterComponentProperties> = GroupOptionsBuilder<RepeaterComponentProperties>> =
    GeneralComponentModule<B> & {
        operators?: ComponentConditionOperator[]
        validations?: ComponentValidationRule[]
        mutations?: MutationRule[]
        Component: RepeaterComponent<OptionsBuilderOutput<B>>
    }
