interface FormCrafterErrorOptions {
    code: string
    location: string
    message?: string
}

export class FormCrafterError extends Error {
    public readonly code: string
    public readonly location: string

    constructor({ code, message, location }: FormCrafterErrorOptions) {
        super(message || code)
        this.name = 'FormCrafterError'
        this.code = code
        this.location = location
    }
}
