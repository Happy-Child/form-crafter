import { memo } from 'react'

import { useRepeaterContext, useRowListIndex } from '@form-crafter/generator'
import { isNotEmpty, Nullable } from '@form-crafter/utils'
import { Box, Button } from '@mui/material'

import { ContainerComponentProps } from '../../types'
import { Title } from '../Title'

type Props = Pick<ContainerComponentProps, 'id' | 'parentId' | 'rowId'> & {
    title?: Nullable<string>
}

export const TopLevelContainerHeader = memo<Props>(({ title, id, parentId, rowId }) => {
    const index = useRowListIndex(parentId, rowId)

    const { onRemoveRow } = useRepeaterContext()

    return (
        <Box gap={2} display="flex" justifyContent="space-between">
            {isNotEmpty(title) && (
                <Title id={id}>
                    {title} {index + 1}
                </Title>
            )}
            <Button onClick={() => onRemoveRow({ rowId })}>Remove</Button>
        </Box>
    )
})

TopLevelContainerHeader.displayName = 'TopLevelContainerHeader'
