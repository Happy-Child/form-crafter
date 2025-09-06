import { forwardRef, memo } from 'react'

import { createStaticComponentModule, StaticComponentProps } from '@form-crafter/core'
import { builders } from '@form-crafter/options-builder'

const optionsBuilder = builders.group({
    value: builders.textarea().required().label('Текст'),
})

type ComponentProps = StaticComponentProps<typeof optionsBuilder>

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
    Component: Text,
})
