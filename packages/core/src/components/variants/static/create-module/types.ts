import { MutationRule } from 'packages/core/src/rules'

import { GroupOptionsBuilder, OptionsBuilderOutput } from '../../../../options-builder'
import { GeneralComponentModule } from '../../../create-modules'
import { StaticComponent } from '../generator'
import { StaticComponentProperties } from '../schema'

export type StaticComponentModule<B extends GroupOptionsBuilder<StaticComponentProperties> = GroupOptionsBuilder<StaticComponentProperties>> =
    GeneralComponentModule<B> & {
        mutations?: MutationRule[]
        Component: StaticComponent<OptionsBuilderOutput<B>>
    }
