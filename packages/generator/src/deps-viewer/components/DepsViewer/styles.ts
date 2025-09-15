import styled from '@emotion/styled'
import { Button } from '@mui/material'

export const Root = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    z-index: 2;
    background-color: #fff;
    box-shadow: 0 2px 10px #4b4b4bff;
    max-width: 1000px;
    width: 100%;
    padding: 1rem;
`

export const ButtonStyled = styled(Button)`
    margin-bottom: 1rem;
`
