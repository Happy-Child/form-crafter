import { GroupOptionsBuilder, OptionsBuilderOutput } from '../../../../../options-builder'
import { EditableComponentModule } from '../../../../create-modules'
import { SelectComponent } from '../generator'
import { SelectComponentProperties } from '../schema'

export type SelectComponentModule<B extends GroupOptionsBuilder<SelectComponentProperties> = GroupOptionsBuilder<SelectComponentProperties>> =
    EditableComponentModule<B> & {
        Component: SelectComponent<OptionsBuilderOutput<B>>
    }
