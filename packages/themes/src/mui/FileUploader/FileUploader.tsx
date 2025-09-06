import { forwardRef, memo } from 'react'

import { createUploaderComponentModule, UploaderComponentProps } from '@form-crafter/core'
import { builders } from '@form-crafter/options-builder'
import { isNotEmpty } from '@form-crafter/utils'
import { FormControl, FormHelperText, FormLabel } from '@mui/material'

const optionsBuilder = builders.group({
    label: builders.text().label('Название'),
    disabled: builders.checkbox().label('Блокировка ввода'),
    readonly: builders.checkbox().label('Только для чтения').required().nullable(),
    value: builders.group({
        url: builders.text().nullable(),
        fileId: builders.number().nullable(),
        file: builders.number().nullable(),
    }),
})

type ComponentProps = UploaderComponentProps<typeof optionsBuilder>

const FileUploader = memo(
    forwardRef<HTMLDivElement, ComponentProps>(({ properties: { value, label }, isRequired, firstError }, ref) => {
        console.log('FileUploader value: ', value)

        return (
            <FormControl ref={ref} required={isRequired} fullWidth error={isNotEmpty(firstError?.message)}>
                {label && <FormLabel>{label}</FormLabel>}
                <h2>todo</h2>
                {isNotEmpty(firstError?.message) && <FormHelperText>{firstError.message}</FormHelperText>}
            </FormControl>
        )
    }),
)

FileUploader.displayName = 'FileUploader'

export const checkboxModule = createUploaderComponentModule({
    name: 'file-uploader',
    label: 'FileUploader',
    optionsBuilder,
    Component: FileUploader,
})
