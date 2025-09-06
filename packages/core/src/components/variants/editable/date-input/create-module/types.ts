import { GroupOptionsBuilder, OptionsBuilderOutput } from '../../../../../options-builder'
import { EditableComponentModule } from '../../../../create-modules'
import { DateInputComponent } from '../generator'
import { DateInputComponentProperties } from '../schema'

export type DateInputComponentModule<B extends GroupOptionsBuilder<DateInputComponentProperties> = GroupOptionsBuilder<DateInputComponentProperties>> =
    EditableComponentModule<B> & {
        Component: DateInputComponent<OptionsBuilderOutput<B>>
    }
