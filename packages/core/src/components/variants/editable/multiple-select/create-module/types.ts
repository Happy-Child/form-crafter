import { GroupOptionsBuilder, OptionsBuilderOutput } from '../../../../../options-builder'
import { EditableComponentModule } from '../../../../modules'
import { MultipleSelectComponent } from '../generator'
import { MultipleSelectComponentProperties } from '../schema'

export type MultipleSelectComponentModule<
    B extends GroupOptionsBuilder<MultipleSelectComponentProperties> = GroupOptionsBuilder<MultipleSelectComponentProperties>,
> = EditableComponentModule<B> & {
    Component: MultipleSelectComponent<OptionsBuilderOutput<B>>
}
