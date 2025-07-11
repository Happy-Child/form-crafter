import { GroupOptionsBuilder } from '../../options-builder'
import { EditableComponentProperties, UploaderComponentProperties } from '../../types'
import { ComponentModule, EditableComponentModule, UploaderComponentModule } from '../types'

export const isComponentModuleWithOperators = (
    module: ComponentModule,
): module is
    | EditableComponentModule<GroupOptionsBuilder<EditableComponentProperties>>
    | UploaderComponentModule<GroupOptionsBuilder<UploaderComponentProperties>> => 'operatorsForConditions' in module
