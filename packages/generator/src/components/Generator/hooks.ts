import { useUnit } from 'effector-react'

import { useGeneratorContext } from '../../contexts'
import { RenderBottomProps } from '../../types'

export const useRenderBottomProps = (): RenderBottomProps => {
    const { services } = useGeneratorContext()

    const [isValid, isValidationPending, groupValidationErrors] = useUnit([
        services.componentsService.formValidationModel.$formIsValid,
        services.componentsService.formValidationModel.$isValidationPending,
        services.componentsService.formValidationModel.$groupValidationErrors,
    ])

    return { isValid, isValidationPending, groupValidationErrors }
}
