import { CSSProperties } from 'react'

export const getStyles = (styles: Record<string, string | number> & CSSProperties): CSSProperties => styles as CSSProperties
