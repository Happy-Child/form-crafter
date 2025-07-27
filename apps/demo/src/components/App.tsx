import { Generator } from '@form-crafter/generator'
import { muiTheme } from '@form-crafter/themes'
import { isNotEmpty } from '@form-crafter/utils'
import { Alert, Button, Container, Paper, Stack, Typography } from '@mui/material'
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
                    renderBottom={({ isValidationPending, groupValidationErrors }) => (
                        <Stack spacing={2} mt={5}>
                            <Button loading={isValidationPending} variant="contained" size="large" type="submit">
                                Send
                            </Button>
                            {isNotEmpty(groupValidationErrors) && (
                                <Alert severity="error">
                                    {groupValidationErrors.map((err, idx) => (
                                        <Typography key={idx} variant="body2">
                                            {err.message}
                                        </Typography>
                                    ))}
                                </Alert>
                            )}
                        </Stack>
                    )}
                />
            </Paper>
        </Container>
    )
}
