import { GroupOptionsBuilder } from '../../../../../options-builder'
import { NumberInputComponentProperties } from '../schema'
import { NumberInputComponentModule } from './types'

export const createNumberInputComponentModule = <O extends GroupOptionsBuilder<NumberInputComponentProperties>>(
    params: NumberInputComponentModule<O>,
): NumberInputComponentModule<GroupOptionsBuilder<NumberInputComponentProperties>> => {
    return params
}
