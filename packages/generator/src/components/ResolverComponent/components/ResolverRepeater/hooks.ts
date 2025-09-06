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

    const addChildEvent = useUnit(services.repeaterService.addChildEvent)
    const onAddRow = useCallback(() => addChildEvent({ repeaterId: id }), [id, addChildEvent])

    const removeChildEvent = useUnit(services.repeaterService.removeChildEvent)
    const onRemoveRow = useCallback<RepeaterComponentProps['onRemoveRow']>(({ rowId }) => removeChildEvent({ rowId, repeaterId: id }), [id, removeChildEvent])

    return { onAddRow, onRemoveRow }
}
