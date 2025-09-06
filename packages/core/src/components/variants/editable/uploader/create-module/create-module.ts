import { GroupOptionsBuilder } from '../../../../../options-builder'
import { UploaderComponentProperties } from '../schema'
import { UploaderComponentModule } from './types'

export const createUploaderComponentModule = <O extends GroupOptionsBuilder<UploaderComponentProperties>>(
    params: UploaderComponentModule<O>,
): UploaderComponentModule<GroupOptionsBuilder<UploaderComponentProperties>> => {
    return params
}
