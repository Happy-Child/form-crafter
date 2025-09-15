import { GroupOptionsBuilder, OptionsBuilderOutput } from '../../../../../options-builder'
import { EditableComponentModule } from '../../../../modules'
import { UploaderComponent } from '../generator'
import { UploaderComponentProperties } from '../schema'

export type UploaderComponentModule<B extends GroupOptionsBuilder<UploaderComponentProperties> = GroupOptionsBuilder<UploaderComponentProperties>> =
    EditableComponentModule<B> & {
        Component: UploaderComponent<OptionsBuilderOutput<B>>
    }
