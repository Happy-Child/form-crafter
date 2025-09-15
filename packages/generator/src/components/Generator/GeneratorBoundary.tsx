import { FC, memo, useCallback } from 'react'

import { ErrorBoundary } from '@form-crafter/utils'
import { Alert, AlertTitle } from '@mui/material'

import { GeneratorProps } from '../../types'
import { GeneratorInit } from './GeneratorInit'

export const GeneratorBoundary: FC<GeneratorProps> = memo((props) => {
    const fallback = useCallback(
        (error: Error) => (
            <Alert severity="error">
                <AlertTitle>{error.name}</AlertTitle>
                {error.message}
            </Alert>
        ),
        [],
    )

    return (
        <ErrorBoundary fallback={fallback}>
            <GeneratorInit {...props} />
        </ErrorBoundary>
    )
})

GeneratorBoundary.displayName = 'GeneratorBoundary'
