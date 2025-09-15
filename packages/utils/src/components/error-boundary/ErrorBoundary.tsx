import { Component, ErrorInfo, ReactNode } from 'react'

import { isNotEmpty } from '../../utils'

interface ErrorBoundaryProps {
    fallback?: (error: Error) => ReactNode
    children: ReactNode
}

interface ErrorBoundaryState {
    hasError: boolean
    error: Error | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    state: ErrorBoundaryState = { hasError: false, error: null }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error }
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        console.error('Caught an error:', error, info)
    }

    render() {
        const { hasError, error } = this.state
        const { children, fallback } = this.props

        if (hasError && error) {
            if (isNotEmpty(fallback)) {
                return fallback(error)
            }

            return (
                <div style={{ padding: 20, border: '1px solid red', color: 'red' }}>
                    <h2>Что-то пошло не так.</h2>
                    <p>{this.state.error?.message}</p>
                </div>
            )
        }

        return children
    }
}
