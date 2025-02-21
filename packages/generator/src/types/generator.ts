import { Schema } from '@form-crafter/core'

export type GeneratorProps = {
    schema: Schema
    onSubmit: (data: Schema) => void
}
