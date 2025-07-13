import { SchemaLayout } from '@form-crafter/core'
import { useUnit } from 'effector-react'

import { useGeneratorContext } from '../contexts'

export const useGeneratorLayout = (): Required<SchemaLayout> => {
    const { services } = useGeneratorContext()
    return useUnit(services.schemaService.$layout)
}
