import { GroupOptionsBuilder, OptionsBuilderOutput } from '../../../../options-builder'
import { GeneralComponentModule } from '../../../modules'
import { ContainerComponent } from '../generator'
import { ContainerComponentProperties } from '../schema'

export type ContainerComponentModule<B extends GroupOptionsBuilder<ContainerComponentProperties> = GroupOptionsBuilder<ContainerComponentProperties>> =
    GeneralComponentModule<B> & {
        Component: ContainerComponent<OptionsBuilderOutput<B>>
    }
