import { StrictMode } from 'react'

import { Global } from '@emotion/react'
import * as ReactDOM from 'react-dom/client'

import { App } from './components/App'
import { globalStyles } from './styles'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
    <StrictMode>
        <Global styles={globalStyles} />
        <App />
    </StrictMode>,
)
