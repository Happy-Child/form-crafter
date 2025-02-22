import { FormCrafterProvider } from '@form-crafter/core'
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
        <FormCrafterProvider theme={muiTheme} PlaceholderComponent={PlaceholderComponent}>
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Paper elevation={3} sx={{ p: 4 }}>
                    <Generator onSubmit={handleeSubmit} schema={employeeFormSchema} renderBottom={() => <Button type="submit">Send</Button>} />
                </Paper>
            </Container>
        </FormCrafterProvider>
    )
}
