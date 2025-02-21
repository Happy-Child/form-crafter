import { ComponentProperties, ComponentType, EntityId } from '@form-crafter/core'
import { useUnit } from 'effector-react'
import { useCallback } from 'react'

import { useGeneratorContext } from '../contexts'

export const useChangePropertiesHandler = <T extends ComponentType = ComponentType>(id: EntityId) => {
    const { services } = useGeneratorContext()
    const updateEvent = useUnit(services.componentsSchemasService.updateComponentPropertiesEvent)

    return useCallback((data: Partial<ComponentProperties<T>>) => updateEvent({ id, data }), [id, updateEvent])
}
