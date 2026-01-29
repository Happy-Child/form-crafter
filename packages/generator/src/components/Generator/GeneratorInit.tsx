import { FC, memo, useState } from 'react'

import { Alert, AlertTitle } from '@mui/material'
import { attachLogger } from 'effector-logger'
import { useUnit } from 'effector-react'
import { isEmpty } from 'lodash-es'

import { effectorDebuggerOn } from '../../consts'
import { GeneratorProvider } from '../../contexts'
import { DepsViewer } from '../../deps-viewer'
import { createRootServices } from '../../services'
import { GeneratorProps } from '../../types'
import { Generator } from './Generator'

if (effectorDebuggerOn) {
    attachLogger()
}

export const GeneratorInit: FC<GeneratorProps> = memo(({ schema, initialValues, theme, PlaceholderComponent, onSubmit, ...props }) => {
    const [services] = useState(() => createRootServices({ schema, initialValues, onSubmit, theme, PlaceholderComponent }))

    const [appErrors] = useUnit([services.appErrorsService.$errors])

    return (
        <GeneratorProvider services={services}>
            <DepsViewer />
            {isEmpty(appErrors) ? (
                <Generator {...props} />
            ) : (
                <Alert severity="error">
                    <AlertTitle>Generator error</AlertTitle>
                    {appErrors[0].message}
                </Alert>
            )}
        </GeneratorProvider>
    )
})

GeneratorInit.displayName = 'GeneratorInit'
