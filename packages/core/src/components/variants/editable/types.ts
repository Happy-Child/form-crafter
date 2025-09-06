import { AvailableObject, AvailableValue } from '@form-crafter/utils'

import { GroupOptionsBuilder, OptionsBuilderOutput } from '../../../options-builder'
import { ComponentValidationError, GeneratorComponentProps } from '../../generator'
import { ComponentMeta, GeneralComponentSchema } from '../../schema'
import { ComponentType } from '../../types'

export type EditableComponentProperties = AvailableObject & { value: AvailableValue }

export type EditableComponentAdditionalProps<P extends AvailableObject = AvailableObject> = {
    onBlur: () => void
    onChangeProperties: (changes: Partial<P>) => void
    errors: ComponentValidationError[] | null
    firstError: ComponentValidationError | null
    isRequired: boolean
}

export type EditableComponentPropsAsObject<T extends ComponentType, P extends AvailableObject = AvailableObject> = GeneratorComponentProps<T, P> &
    EditableComponentAdditionalProps<P>

export type EditableComponentProps<T extends ComponentType, B extends GroupOptionsBuilder> = EditableComponentPropsAsObject<T, OptionsBuilderOutput<B>>

export type EditableComponentSchema<T extends ComponentType, P extends EditableComponentProperties = EditableComponentProperties> = GeneralComponentSchema & {
    meta: ComponentMeta<T>
    properties: P
}
