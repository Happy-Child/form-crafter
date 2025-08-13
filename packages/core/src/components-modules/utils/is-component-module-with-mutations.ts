import { GroupOptionsBuilder } from '../../options-builder'
import { EditableComponentProperties, UploaderComponentProperties } from '../../types'
import { ComponentModule, EditableComponentModule, UploaderComponentModule } from '../types'

export const isComponentModuleWithMutations = (
    module: ComponentModule,
): module is
    | EditableComponentModule<GroupOptionsBuilder<EditableComponentProperties>>
    | UploaderComponentModule<GroupOptionsBuilder<UploaderComponentProperties>> => 'mutationsRules' in module
