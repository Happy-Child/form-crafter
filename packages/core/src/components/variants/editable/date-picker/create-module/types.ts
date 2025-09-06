import { GroupOptionsBuilder, OptionsBuilderOutput } from '../../../../../options-builder'
import { EditableComponentModule } from '../../../../create-modules'
import { DatePickerComponent } from '../generator'
import { DatePickerComponentProperties } from '../schema'

export type DatePickerComponentModule<B extends GroupOptionsBuilder<DatePickerComponentProperties> = GroupOptionsBuilder<DatePickerComponentProperties>> =
    EditableComponentModule<B> & {
        Component: DatePickerComponent<OptionsBuilderOutput<B>>
    }
