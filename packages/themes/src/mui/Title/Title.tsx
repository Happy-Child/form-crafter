import { ContainerComponentProps } from '@form-crafter/core'
import { useComponentDepth } from '@form-crafter/generator'
import { Typography } from '@mui/material'
import { memo, PropsWithChildren, useMemo } from 'react'

type Props = PropsWithChildren<Pick<ContainerComponentProps, 'id'>>

const fontSize: Record<string, string> = {
    '0': '32px',
    '1': '28px',
    '2': '24px',
    '3': '18px',
}

const fontSizeDefault = fontSize['3']

const getFontSize = (deepLevel: number): string => (deepLevel.toString() in fontSize ? fontSize[deepLevel.toString()] : fontSizeDefault)

export const Title = memo<Props>(({ id, children }) => {
    const deep = useComponentDepth(id)
    const styles = useMemo(() => ({ fontSize: getFontSize(deep) }), [deep])

    return <Typography style={styles}>{children}</Typography>
})

Title.displayName = 'Title'
