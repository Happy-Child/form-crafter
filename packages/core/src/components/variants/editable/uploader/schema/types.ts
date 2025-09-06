import { EditableComponentProperties, EditableComponentSchema } from '../../types'

export type UploaderComponentProperties = EditableComponentProperties

export type UploaderComponentSchema<T extends UploaderComponentProperties = UploaderComponentProperties> = EditableComponentSchema<'uploader', T>
