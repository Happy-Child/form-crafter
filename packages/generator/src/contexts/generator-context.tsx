import { createContext, FC, PropsWithChildren, useContext, useRef } from 'react'

import { isNull } from '@form-crafter/utils'

import { RootServices } from '../services'

type StoreContext = {
    services: RootServices
}

const generatorContext = createContext<StoreContext | null>(null)

const { Provider } = generatorContext

export const GeneratorProvider: FC<PropsWithChildren<StoreContext>> = ({ services, children }) => {
    const value = useRef({ services })
    return <Provider value={value.current}>{children}</Provider>
}

export const useGeneratorContext = () => {
    const data = useContext(generatorContext)

    if (isNull(data)) {
        throw new Error('GeneratorContext not provided')
    }

    return data
}
