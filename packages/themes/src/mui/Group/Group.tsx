import { ContainerComponentProps, createContainerComponentModule, OptionsBuilderOutput } from '@form-crafter/core'
import { RowsList, useIsRepeater } from '@form-crafter/generator'
import { builders } from '@form-crafter/options-builder'
import { isNotEmpty } from '@form-crafter/utils'
import { Box } from '@mui/material'
import { forwardRef, memo } from 'react'

import { rules } from '../../rules'
import { Title } from '../Title'
import { TopLevelContainerHeader } from './TopLevelContainerHeader'

const optionsBuilder = builders.group({
    title: builders.text().label('Заголовок').nullable(),
})

type ComponentProps = ContainerComponentProps<OptionsBuilderOutput<typeof optionsBuilder>>

const Group = memo(
    forwardRef<HTMLDivElement, ComponentProps>(({ rows, properties, ...props }, ref) => {
        const isTopLevelContainer = useIsRepeater(props.parentId)

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

export const groupModule = createContainerComponentModule({
    name: 'group',
    label: 'Group',
    optionsBuilder,
    relationsRules: [rules.relations.hiddenRule],
    Component: Group,
})
