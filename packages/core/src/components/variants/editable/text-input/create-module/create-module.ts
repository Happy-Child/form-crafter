import { GroupOptionsBuilder } from '../../../../../options-builder'
import { TextInputComponentProperties } from '../schema'
import { TextInputComponentModule } from './types'

export const createTextInputComponentModule = <O extends GroupOptionsBuilder<TextInputComponentProperties>>(
    params: TextInputComponentModule<O>,
): TextInputComponentModule<GroupOptionsBuilder<TextInputComponentProperties>> => {
    return params
}
