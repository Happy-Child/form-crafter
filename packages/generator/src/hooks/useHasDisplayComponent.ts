import { EntityId, useFormCrafterContext } from '@form-crafter/core'
import { isNotEmpty } from '@form-crafter/utils'
import { FC, useMemo } from 'react'

import { useComponentMeta } from './useComponentMeta'

export const useHasDisplayComponent = (id: EntityId): [boolean, FC] => {
    const meta = useComponentMeta(id)
    const { theme, PlaceholderComponent } = useFormCrafterContext()

    const module = useMemo(() => theme.find(({ name }) => name === meta.name), [theme, meta])

    return [isNotEmpty(module?.Component), PlaceholderComponent]
}
