import { ComponentModel, UploaderModel } from '../../types'

export const isUploaderModel = (model: ComponentModel): model is UploaderModel => {
    const schema = model.$schema.getState()
    return schema.meta.type === 'uploader'
}
