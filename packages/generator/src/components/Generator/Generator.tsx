import { FC, FormEvent, memo, useCallback } from 'react'

import { isNotEmpty } from '@form-crafter/utils'

import { useGeneratorContext } from '../../contexts'
import { useRootViewElementsRows } from '../../hooks'
import { GeneratorProps } from '../../types'
import { RowsList } from '../RowsList'
import { useRenderBottomProps } from './hooks'
import { Form } from './styles'

export const Generator: FC<Pick<GeneratorProps, 'renderBottom'>> = memo(({ renderBottom }) => {
    const { services } = useGeneratorContext()

    const rootViewElementsRows = useRootViewElementsRows()
    const renderBottomProps = useRenderBottomProps()

    const handleSubmit = useCallback(
        (e: FormEvent<HTMLFormElement>) => {
            e.preventDefault()
            services.formService.onFormSubmit()
        },
        [services],
    )

    return (
        <Form noValidate onSubmit={handleSubmit}>
            {isNotEmpty(rootViewElementsRows) && <RowsList rows={rootViewElementsRows} />}
            {renderBottom?.(renderBottomProps)}
        </Form>
    )
})

Generator.displayName = 'Generator'
