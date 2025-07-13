import { GroupOptionsBuilder } from '../../options-builder'
import { EditableComponentProperties, RepeaterComponentProperties, UploaderComponentProperties } from '../../types'
import { ComponentModule, EditableComponentModule, RepeaterComponentModule, UploaderComponentModule } from '../types'

export const isComponentModuleWithValidations = (
    module: ComponentModule,
): module is
    | EditableComponentModule<GroupOptionsBuilder<EditableComponentProperties>>
    | RepeaterComponentModule<GroupOptionsBuilder<RepeaterComponentProperties>>
    | UploaderComponentModule<GroupOptionsBuilder<UploaderComponentProperties>> => 'validationsRules' in module
