import { Generator } from '@form-crafter/generator'
import { muiTheme } from '@form-crafter/themes'
import { Button, Container, Paper } from '@mui/material'
import { FC, useCallback } from 'react'

import { employeeFormSchema } from '../mock-schemas'

const PlaceholderComponent: FC = () => <div>Not found component</div>

export const App: FC = () => {
    const handleeSubmit = useCallback((data: any) => {
        console.log(data)
    }, [])

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Generator
                    onSubmit={handleeSubmit}
                    theme={muiTheme}
                    PlaceholderComponent={PlaceholderComponent}
                    schema={employeeFormSchema}
                    renderBottom={({ isValidationPending }) => (
                        <Button loading={isValidationPending} type="submit">
                            Send
                        </Button>
                    )}
                />
            </Paper>
        </Container>
    )
}
