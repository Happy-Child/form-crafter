import { GroupOptionsBuilder, OptionsBuilderOutput } from '../../../../../options-builder'
import { EditableComponentModule } from '../../../../create-modules'
import { DateRangeComponent } from '../generator'
import { DateRangeComponentProperties } from '../schema'

export type DateRangeComponentModule<B extends GroupOptionsBuilder<DateRangeComponentProperties> = GroupOptionsBuilder<DateRangeComponentProperties>> =
    EditableComponentModule<B> & {
        Component: DateRangeComponent<OptionsBuilderOutput<B>>
    }
