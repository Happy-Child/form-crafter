import { createComponentModule, FormCrafterComponentProps, OptionsBuilderOutput } from '@form-crafter/core'
import { builders } from '@form-crafter/options-builder'
import { forwardRef, memo } from 'react'

const optionsBuilder = builders.group({
    value: builders.textarea().required().label('Текст'),
})

type ComponentProps = FormCrafterComponentProps<'base', OptionsBuilderOutput<typeof optionsBuilder>>

const Text = memo(
    forwardRef<HTMLDivElement, ComponentProps>(({ properties: { value } }, ref) => {
        return <div ref={ref}>{value}</div>
    }),
)

Text.displayName = 'Text'

export const textModule = createComponentModule({
    name: 'text',
    label: 'Text',
    type: 'base',
    optionsBuilder,
    Component: Text,
})
