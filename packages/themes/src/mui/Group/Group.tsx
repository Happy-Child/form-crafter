import { forwardRef, memo } from 'react'

import { createContainerComponentModule } from '@form-crafter/core'
import { RowsList, useIsRepeater } from '@form-crafter/generator'
import { isNotEmpty } from '@form-crafter/utils'
import { Box } from '@mui/material'

import { Title } from './components/Title'
import { TopLevelContainerHeader } from './components/TopLevelContainerHeader'
import { optionsBuilder } from './options-builder'
import { ContainerComponentProps } from './types'

const Group = memo(
    forwardRef<HTMLDivElement, ContainerComponentProps>(({ rows, properties, ...props }, ref) => {
        const parentIsRepeater = useIsRepeater(props.parentId)

        const header = parentIsRepeater ? (
            <TopLevelContainerHeader {...props} title={properties.title} />
        ) : (
            isNotEmpty(properties.title) && <Title id={props.id}>{properties.title}</Title>
        )

        return (
            <Box ref={ref} gap={2}>
                {header}
                {isNotEmpty(rows) && <RowsList rows={rows} />}
            </Box>
        )
    }),
)

Group.displayName = 'Group'

export const groupModule = createContainerComponentModule({
    name: 'group',
    label: 'Group',
    optionsBuilder,
    Component: Group,
})
