import { useUnit } from 'effector-react'

import { useGeneratorContext } from '../../contexts'
import { useGeneratorLayout } from '../../hooks'
import { RenderBottomProps } from '../../types'
import { getStyleVariables } from './utils'

export const useGeneratorStylesVars = () => {
    const layout = useGeneratorLayout()

    return getStyleVariables(layout)
}

export const useRenderBottomProps = (): RenderBottomProps => {
    const { services } = useGeneratorContext()

    const [isValid, isValidationPending] = useUnit([
        services.componentsSchemasService.$componentsIsValid,
        services.componentsSchemasService.$isValidationComponentsPending,
    ])

    return { isValid, isValidationPending }
}
