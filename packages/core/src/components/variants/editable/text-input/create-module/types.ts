import { GroupOptionsBuilder, OptionsBuilderOutput } from '../../../../../options-builder'
import { EditableComponentModule } from '../../../../create-modules'
import { TextInputComponent } from '../generator'
import { TextInputComponentProperties } from '../schema'

export type TextInputComponentModule<B extends GroupOptionsBuilder<TextInputComponentProperties> = GroupOptionsBuilder<TextInputComponentProperties>> =
    EditableComponentModule<B> & {
        Component: TextInputComponent<OptionsBuilderOutput<B>>
    }
