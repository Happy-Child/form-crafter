import { ContainerComponentProps } from '@form-crafter/core'
import { useDynamicContainerContext, useRowListIndex } from '@form-crafter/generator'
import { isNotEmpty, Nullable } from '@form-crafter/utils'
import { Box, Button } from '@mui/material'
import { memo } from 'react'

import { Title } from '../Title'

type Props = Pick<ContainerComponentProps, 'id' | 'parentId' | 'rowId'> & {
    title?: Nullable<string>
}

export const TopLevelContainerHeader = memo<Props>(({ title, id, parentId, rowId }) => {
    const index = useRowListIndex(parentId, rowId)

    const { onRemoveRow } = useDynamicContainerContext()

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
