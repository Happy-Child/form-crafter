import { useUnit } from 'effector-react'

import { useGeneratorContext } from '../../contexts'
import { RenderBottomProps } from '../../types'

export const useRenderBottomProps = (): RenderBottomProps => {
    const { services } = useGeneratorContext()

    const [isValid, isValidationPending, groupValidationErrors] = useUnit([
        services.componentsSchemasService.formValidationModel.$formIsValid,
        services.componentsSchemasService.formValidationModel.$isValidationPending,
        services.componentsSchemasService.formValidationModel.$groupValidationErrors,
    ])

    return { isValid, isValidationPending, groupValidationErrors }
}
