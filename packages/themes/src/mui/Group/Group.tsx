import { createComponentModule, FormCrafterComponentProps, OptionsBuilderOutput } from '@form-crafter/core'
import { RowsList, useIsDynamicContainer } from '@form-crafter/generator'
import { builders } from '@form-crafter/options-builder'
import { isNotEmpty } from '@form-crafter/utils'
import { Box } from '@mui/material'
import { forwardRef, memo } from 'react'

import { Title } from '../Title'
import { TopLevelContainerHeader } from './TopLevelContainerHeader'

const optionsBuilder = builders.group({
    title: builders.input().label('Заголовок').nullable(),
})

type ComponentProps = FormCrafterComponentProps<'container', OptionsBuilderOutput<typeof optionsBuilder>>

const Group = memo(
    forwardRef<HTMLDivElement, ComponentProps>(({ rows, properties, ...props }, ref) => {
        const isTopLevelContainer = useIsDynamicContainer(props.parentId)

        const header = isTopLevelContainer ? (
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

export const groupModule = createComponentModule({
    name: 'group',
    label: 'Group',
    type: 'container',
    optionsBuilder,
    Component: Group,
})
