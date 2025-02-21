import { MutableRefObject, RefCallback, useCallback } from 'react'

import { isFunction } from '../utils'

type CombinedRef<T extends HTMLElement> = RefCallback<T | null> | MutableRefObject<T | null> | null

type UseCombinedRefs<T extends HTMLElement> = (el: T | null) => void

export const useCombinedRefs = <T extends HTMLElement>(...refs: CombinedRef<T>[]): UseCombinedRefs<T> => {
    return useCallback(
        (el: T | null) => {
            refs.forEach((ref) => {
                if (!ref) {
                    return
                }

                if (isFunction(ref)) {
                    ref(el)
                } else {
                    ref.current = el
                }
            })
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        refs,
    )
}
