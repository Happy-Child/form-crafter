import { FC, memo, useState } from 'react'

import { GeneratorProvider } from '../../contexts'
import { createRootServices } from '../../services'
import { GeneratorProps } from '../../types'
import { Generator } from './Generator'

export const GeneratorWithProvider: FC<GeneratorProps> = memo(({ schema, onSubmit, ...props }) => {
    const [services] = useState(() => createRootServices({ schema, onSubmit }))

    return (
        <GeneratorProvider services={services}>
            <Generator {...props} />
        </GeneratorProvider>
    )
})

GeneratorWithProvider.displayName = 'GeneratorWithProvider'
