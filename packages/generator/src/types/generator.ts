import { FC, ReactNode } from 'react'

import { FormCrafterTheme, GroupValidationError, Schema } from '@form-crafter/core'
import { AvailableObject } from '@form-crafter/utils'

export type RenderBottomProps = {
    isValid: boolean
    isValidationPending: boolean
    groupValidationErrors: GroupValidationError[]
}

export type GeneratorProps = {
    schema: Schema
    onSubmit: (data: AvailableObject) => void
    renderBottom?: (props: RenderBottomProps) => ReactNode
    theme: FormCrafterTheme
    PlaceholderComponent: FC
}
