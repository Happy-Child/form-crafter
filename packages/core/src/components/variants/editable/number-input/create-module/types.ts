import { GroupOptionsBuilder, OptionsBuilderOutput } from '../../../../../options-builder'
import { EditableComponentModule } from '../../../../create-modules'
import { NumberInputComponent } from '../generator'
import { NumberInputComponentProperties } from '../schema'

export type NumberInputComponentModule<B extends GroupOptionsBuilder<NumberInputComponentProperties> = GroupOptionsBuilder<NumberInputComponentProperties>> =
    EditableComponentModule<B> & {
        Component: NumberInputComponent<OptionsBuilderOutput<B>>
    }
