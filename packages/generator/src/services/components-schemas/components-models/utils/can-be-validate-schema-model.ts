import { ComponentSchemaModel } from '../types'
import { isValidableSchemaModel } from './is-validable-schema-model'

export const canBeValidateSchemaModel = (model: ComponentSchemaModel): boolean => {
    const isVisibleComponent = model.$schema.getState().visability?.hidden !== true
    return isValidableSchemaModel(model) && isVisibleComponent
}
