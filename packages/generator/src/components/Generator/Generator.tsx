import { FC, FormEvent, memo, useCallback } from 'react'

import { isNotEmpty } from '@form-crafter/utils'

import { useGeneratorContext } from '../../contexts'
import { useRootViewComponent } from '../../hooks'
import { GeneratorProps } from '../../types'
import { RowsList } from '../RowsList'
import { useRenderBottomProps } from './hooks'
import { Form } from './styles'

export const Generator: FC<Pick<GeneratorProps, 'renderBottom'>> = memo(({ renderBottom }) => {
    const { services } = useGeneratorContext()

    const { rows } = useRootViewComponent()
    const renderBottomProps = useRenderBottomProps()

    const handleSubmit = useCallback(
        (e: FormEvent<HTMLFormElement>) => {
            e.preventDefault()
            services.formService.onFormSubmitEvent()
        },
        [services],
    )

    return (
        <Form noValidate onSubmit={handleSubmit}>
            {isNotEmpty(rows) && <RowsList rows={rows} />}
            {renderBottom?.(renderBottomProps)}
        </Form>
    )
})

Generator.displayName = 'Generator'
