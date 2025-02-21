import { ComponentProperties, ComponentType, EntityId, FormCrafterComponent, useFormCrafterContext } from '@form-crafter/core'
import { useMemo } from 'react'

import { useComponentMeta } from './useComponentMeta'

export const useDisplayComponent = <T extends ComponentType = ComponentType>(id: EntityId) => {
    const meta = useComponentMeta(id)
    const { theme } = useFormCrafterContext()

    const module = useMemo(() => theme.find(({ name }) => name === meta.name), [theme, meta])

    return module?.Component as FormCrafterComponent<T, ComponentProperties<T>>
}
