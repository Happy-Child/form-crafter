import { isNotEmpty } from '@form-crafter/utils'
import { FC, FormEvent, memo, ReactNode, useCallback } from 'react'

import { useGeneratorContext } from '../../contexts'
import { useRootViewComponent } from '../../hooks'
import { RowsList } from '../RowsList'
import { Form } from './styles'

export const Generator: FC<{ renderBottom?: () => ReactNode }> = memo(({ renderBottom }) => {
    const { services } = useGeneratorContext()

    const { rows } = useRootViewComponent()

    const handleSubmit = useCallback(
        (e: FormEvent<HTMLFormElement>) => {
            e.preventDefault()
            services.formService.onFormSubmitEvent()
        },
        [services],
    )

    return (
        <Form onSubmit={handleSubmit}>
            {isNotEmpty(rows) && <RowsList rows={rows} />}
            {renderBottom?.()}
        </Form>
    )
})

Generator.displayName = 'Generator'
