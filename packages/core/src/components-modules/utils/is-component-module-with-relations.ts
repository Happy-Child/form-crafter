import { GroupOptionsBuilder } from '../../options-builder'
import { EditableComponentProperties, UploaderComponentProperties } from '../../types'
import { ComponentModule, EditableComponentModule, UploaderComponentModule } from '../types'

export const isComponentModuleWithRelations = (
    module: ComponentModule,
): module is
    | EditableComponentModule<GroupOptionsBuilder<EditableComponentProperties>>
    | UploaderComponentModule<GroupOptionsBuilder<UploaderComponentProperties>> => 'relationsRules' in module
