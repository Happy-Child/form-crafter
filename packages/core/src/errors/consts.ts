export const errorCodes = {
    circularDepDetected: 'circularDepDetected',
} as const

export const errorMessages: Record<string, string> = {
    circularDepDetected: 'Circular dependency detected',
}

export const getErrorMessages = (code: string) => errorMessages[code]
