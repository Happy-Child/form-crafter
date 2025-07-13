import { isNull } from '@form-crafter/utils'
import { createContext, FC, PropsWithChildren, useContext, useMemo } from 'react'

import { FormCrafterTheme } from '../schema'

type FormCrafterContext = {
    theme: FormCrafterTheme
    PlaceholderComponent: FC
}

export const formCrafterContext = createContext<FormCrafterContext | null>(null)

const { Provider } = formCrafterContext

export const FormCrafterProvider: FC<PropsWithChildren<FormCrafterContext>> = ({ theme, PlaceholderComponent, children }) => {
    const value = useMemo(() => ({ theme, PlaceholderComponent }), [theme, PlaceholderComponent])
    return <Provider value={value}>{children}</Provider>
}

export const useFormCrafterContext = () => {
    const data = useContext(formCrafterContext)

    if (isNull(data)) {
        throw new Error('FormCrafterContext not provided')
    }

    return data
}
