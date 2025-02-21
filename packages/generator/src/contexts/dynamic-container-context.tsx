import { DynamicContainerComponentProps } from '@form-crafter/core'
import { createContext, FC, PropsWithChildren, useContext, useMemo } from 'react'

type DynamicContainerContext = Pick<DynamicContainerComponentProps, 'onAddRow' | 'onRemoveRow'>

export const dynamicContainerContext = createContext<DynamicContainerContext | null>(null)

const { Provider } = dynamicContainerContext

export const DynamicContainerProvider: FC<PropsWithChildren<DynamicContainerContext>> = ({ onAddRow, onRemoveRow, children }) => {
    const value = useMemo(() => ({ onAddRow, onRemoveRow }), [onAddRow, onRemoveRow])
    return <Provider value={value}>{children}</Provider>
}

export const useDynamicContainerContext = () => {
    const data = useContext(dynamicContainerContext)
    return data!
}
