import { FC } from 'react'

import { AvailableObject, Unwrap } from '@form-crafter/utils'

import { GroupOptionsBuilder, OptionsBuilderOutput } from '../../../../options-builder'
import { EntityId } from '../../../../types'
import { ComponentValidationError, GeneratorComponentProps } from '../../../generator'
import { RepeaterComponentProperties } from '../schema'

export type RepeaterComponentPropsAsObject<P extends AvailableObject = AvailableObject> = GeneratorComponentProps<'repeater', P> & {
    childrenRows: EntityId[]
    onAddRow: () => void
    onRemoveRow: (props: { rowId: EntityId }) => void
    errors: ComponentValidationError[] | null
    firstError: ComponentValidationError | null
    isRequired: boolean
}

export type RepeaterComponentProps<B extends GroupOptionsBuilder = GroupOptionsBuilder> = RepeaterComponentPropsAsObject<OptionsBuilderOutput<B>>

export type RepeaterComponent<T extends RepeaterComponentProperties> = FC<Unwrap<RepeaterComponentPropsAsObject<T>>>
