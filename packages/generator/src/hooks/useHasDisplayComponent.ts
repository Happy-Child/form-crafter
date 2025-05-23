import { EntityId } from '@form-crafter/core'
import { isNotEmpty } from '@form-crafter/utils'
import { useUnit } from 'effector-react'
import { FC, useMemo } from 'react'

import { useGeneratorContext } from '../contexts'
import { useComponentMeta } from './useComponentMeta'

export const useHasDisplayComponent = (id: EntityId): [boolean, FC] => {
    const meta = useComponentMeta(id)
    const { services } = useGeneratorContext()

    const [theme] = useUnit([services.themeService.$theme])
    const [PlaceholderComponent] = useUnit([services.themeService.$placeholderComponent])

    const module = useMemo(() => theme.find(({ name }) => name === meta.name), [theme, meta])

    return [isNotEmpty(module?.Component), PlaceholderComponent]
}
