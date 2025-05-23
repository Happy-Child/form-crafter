import { ComponentModule, Schema } from '@form-crafter/core'
import { FC, ReactNode } from 'react'

export type GeneratorProps = {
    schema: Schema
    onSubmit: (data: any) => void
    renderBottom?: () => ReactNode
    theme: ComponentModule[]
    PlaceholderComponent: FC
}
