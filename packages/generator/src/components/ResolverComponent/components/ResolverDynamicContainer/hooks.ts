import { DynamicContainerComponentProps, EntityId } from '@form-crafter/core'
import { useUnit } from 'effector-react'
import { useCallback } from 'react'

import { useGeneratorContext } from '../../../../contexts'

type UseDynamicContainerEvents = {
    onAddRow: () => void
    onRemoveRow: DynamicContainerComponentProps['onRemoveRow']
}

export const useDynamicContainerEvents = (id: EntityId): UseDynamicContainerEvents => {
    const { services } = useGeneratorContext()

    const addDynamicContainerChildEvent = useUnit(services.dynamicContainerService.addDynamicContainerChildEvent)
    const onAddRow = useCallback(() => addDynamicContainerChildEvent({ dynamicContainerId: id }), [id, addDynamicContainerChildEvent])

    const removeDynamicContainerChildEvent = useUnit(services.dynamicContainerService.removeDynamicContainerChildEvent)
    const onRemoveRow = useCallback<DynamicContainerComponentProps['onRemoveRow']>(
        ({ rowId }) => removeDynamicContainerChildEvent({ rowId, dynamicContainerId: id }),
        [id, removeDynamicContainerChildEvent],
    )

    return { onAddRow, onRemoveRow }
}
