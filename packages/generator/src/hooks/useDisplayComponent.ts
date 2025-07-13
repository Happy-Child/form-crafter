import { ComponentProperties, ComponentType, EntityId, FormCrafterComponent } from '@form-crafter/core'
import { useUnit } from 'effector-react'
import { useMemo } from 'react'

import { useGeneratorContext } from '../contexts'
import { useComponentMeta } from './useComponentMeta'

export const useDisplayComponent = <T extends ComponentType = ComponentType>(id: EntityId) => {
    const meta = useComponentMeta<T>(id)
    const { services } = useGeneratorContext()
    const [theme] = useUnit([services.themeService.$componentsModules])

    const module = useMemo(() => theme.find(({ name }) => name === meta.name), [theme, meta])

    return module?.Component as FormCrafterComponent<T, ComponentProperties<T>>
}
