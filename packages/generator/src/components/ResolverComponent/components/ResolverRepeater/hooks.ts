import { useCallback } from 'react'

import { EntityId, RepeaterComponentProps } from '@form-crafter/core'
import { useUnit } from 'effector-react'

import { useGeneratorContext } from '../../../../contexts'

type UseRepeaterEvents = {
    onAddRow: () => void
    onRemoveRow: RepeaterComponentProps['onRemoveRow']
}

export const useRepeaterEvents = (id: EntityId): UseRepeaterEvents => {
    const { services } = useGeneratorContext()

    const addGroup = useUnit(services.componentsService.repeaterModel.addGroup)
    const onAddRow = useCallback(() => addGroup({ repeaterId: id }), [id, addGroup])

    const removeGroup = useUnit(services.componentsService.repeaterModel.removeGroup)
    const onRemoveRow = useCallback<RepeaterComponentProps['onRemoveRow']>(({ rowId }) => removeGroup({ rowId, repeaterId: id }), [id, removeGroup])

    return { onAddRow, onRemoveRow }
}
