import { FormCrafterTheme, Schema } from '@form-crafter/core'
import { OptionalSerializableObject } from '@form-crafter/utils'
import { FC, ReactNode } from 'react'

export type RenderBottomProps = {
    isValid: boolean
    isValidationPending: boolean
}

export type GeneratorProps = {
    schema: Schema
    onSubmit: (data: OptionalSerializableObject) => void
    renderBottom?: (props: RenderBottomProps) => ReactNode
    theme: FormCrafterTheme
    PlaceholderComponent: FC
}
