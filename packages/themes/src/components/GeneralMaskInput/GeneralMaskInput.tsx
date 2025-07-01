import { EditableComponentProps, MaskOptions } from '@form-crafter/core'
import { useCombinedRefs } from '@form-crafter/utils'
import { useMaskito } from '@maskito/react'
import { FC, ForwardedRef, forwardRef, ReactNode, RefAttributes, useCallback } from 'react'

type InheritedComponent = FC<EditableComponentProps<{ value: any }>>

type Props<T extends InheritedComponent> = Parameters<T>[0] & {
    Component: FC<Parameters<T>[0]>
    maskOptions: MaskOptions
    returnMaskedValue?: boolean
    showMask?: boolean
}

const GeneralMaskInputBase = <T extends InheritedComponent>(
    { maskOptions, Component, onChangeProperties, properties, ...props }: Props<T>,
    rootRef: ForwardedRef<HTMLInputElement>,
): ReactNode => {
    const ref = useMaskito({ options: maskOptions })

    const handleChange = useCallback<typeof onChangeProperties>(
        (params) => {
            if (Object.keys(params).length > 0) {
                onChangeProperties(params)
            }
        },
        [onChangeProperties],
    )

    const refs = useCombinedRefs(ref, rootRef)

    return <Component ref={refs} {...props} properties={properties} onChangeProperties={handleChange} />
}

export const GeneralMaskInput = forwardRef(GeneralMaskInputBase) as unknown as (<T extends InheritedComponent>(
    props: Props<T> & RefAttributes<HTMLDivElement>,
) => ReactNode) & {
    displayName?: string | undefined
}

GeneralMaskInput.displayName = 'GeneralMaskInput'
