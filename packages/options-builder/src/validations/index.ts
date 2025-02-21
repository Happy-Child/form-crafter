export type ValidationCustomFn = (data: any) => boolean

export type ValidationRule = {
    name: string
    params?: object
    execute?: ValidationCustomFn
    message?: string | ((params: object) => string)
}

export type CustomValidationRuleParams = Required<Omit<ValidationRule, 'params'>>

export type LengthValidationRuleParams = { min: number; max?: number } | { min?: number; max: number }
