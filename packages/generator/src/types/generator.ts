import { Schema } from '@form-crafter/core'
import { ReactNode } from 'react'

export type GeneratorProps = {
    schema: Schema
    onSubmit: (data: any) => void
    renderBottom?: () => ReactNode
}
