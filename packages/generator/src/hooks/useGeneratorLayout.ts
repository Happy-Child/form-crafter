import { SchemaLayout } from '@form-crafter/core'
import { useStoreMap } from 'effector-react'

import { useGeneratorContext } from '../contexts'

export const useGeneratorLayout = (): Required<SchemaLayout> => {
    const { services } = useGeneratorContext()

    return useStoreMap({
        store: services.schemaService.$schema,
        keys: [],
        fn: (schema) => schema.layout,
    })
}
