import { FC, memo, useState } from 'react'

import { attachLogger } from 'effector-logger'

import { effectorDebuggerOn } from '../../consts'
import { GeneratorProvider } from '../../contexts'
import { createRootServices } from '../../services'
import { GeneratorProps } from '../../types'
import { Generator } from './Generator'

if (effectorDebuggerOn) {
    attachLogger()
}

export const GeneratorWithProvider: FC<GeneratorProps> = memo(({ schema, theme, PlaceholderComponent, onSubmit, ...props }) => {
    const [services] = useState(() => createRootServices({ schema, onSubmit, theme, PlaceholderComponent }))

    return (
        <GeneratorProvider services={services}>
            <Generator {...props} />
        </GeneratorProvider>
    )
})

GeneratorWithProvider.displayName = 'GeneratorWithProvider'
