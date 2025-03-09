import { RepeaterComponentProps } from '@form-crafter/core'
import { createContext, FC, PropsWithChildren, useContext, useMemo } from 'react'

type RepeaterContext = Pick<RepeaterComponentProps, 'onAddRow' | 'onRemoveRow'>

export const repeaterContext = createContext<RepeaterContext | null>(null)

const { Provider } = repeaterContext

export const RepeaterProvider: FC<PropsWithChildren<RepeaterContext>> = ({ onAddRow, onRemoveRow, children }) => {
    const value = useMemo(() => ({ onAddRow, onRemoveRow }), [onAddRow, onRemoveRow])
    return <Provider value={value}>{children}</Provider>
}

export const useRepeaterContext = () => {
    const data = useContext(repeaterContext)
    return data!
}
