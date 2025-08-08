import { ComponentModel, RepeaterModel } from '../../types'

export const isRepeaterModel = (model: ComponentModel): model is RepeaterModel => {
    const schema = model.$schema.getState()
    return schema.meta.type === 'repeater'
}
