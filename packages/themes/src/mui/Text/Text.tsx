import { createStaticComponentModule, OptionsBuilderOutput, StaticComponentProps } from '@form-crafter/core'
import { builders } from '@form-crafter/options-builder'
import { forwardRef, memo } from 'react'

import { rules } from '../../rules'

const optionsBuilder = builders.group({
    value: builders.textarea().required().label('Текст'),
})

type ComponentProps = StaticComponentProps<OptionsBuilderOutput<typeof optionsBuilder>>

const Text = memo(
    forwardRef<HTMLDivElement, ComponentProps>(({ properties: { value } }, ref) => {
        return <div ref={ref}>{value}</div>
    }),
)

Text.displayName = 'Text'

export const textModule = createStaticComponentModule({
    name: 'text',
    label: 'Text',
    optionsBuilder,
    relationsRules: [rules.relations.hiddenRule],
    Component: Text,
})
