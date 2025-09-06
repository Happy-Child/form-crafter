// export type UniversalValue = string | number | boolean | null

// export type SerializableValue = UniversalValue | SerializableObject | SerializableValue[]

// export type SerializableObject = { [key: string]: SerializableValue }

// export type OptionalSerializableValue = UniversalValue | OptionalSerializableObject | OptionalSerializableValue[] | undefined

// export type OptionalSerializableObject = { [key: string]: OptionalSerializableValue }

export type SomeObject = Record<string, any>

export type OptionalKeys<T extends SomeObject> = keyof {
    [K in keyof T as undefined extends T[K] ? K : never]: T[K]
}

export type RequiredKeys<T extends SomeObject> = keyof Omit<T, OptionalKeys<T>>

export type OptionalIfUndefined<T extends SomeObject> = {
    [K in keyof T as K extends OptionalKeys<T> ? K : never]?: T[K]
} & {
    [K in keyof T as K extends RequiredKeys<T> ? K : never]: T[K]
}

export type NonUndefinable<T> = T extends undefined ? never : T

export type Undefinable<T> = T | undefined

export type Nullable<T> = T | null

export type Maybe<T> = Undefinable<T> | Nullable<T>

export type RequiredType<T> = NonNullable<T> & NonUndefinable<T>

export type NonUndefinableKey<T extends SomeObject, O extends keyof T> = {
    [K in keyof T]: K extends O ? NonUndefinable<T[K]> : T[K]
}

export type Unwrap<T> = T extends SomeObject ? { [K in keyof T]: T[K] } : T

export type MakeKeysOptional<T> = T extends SomeObject ? Unwrap<OptionalIfUndefined<T>> : T

export type ChildType<T> = T extends Array<infer I> ? I : never

// TODO Не поддерживает вложенные объекты в массивы
export type RequiredDeepObject<T extends SomeObject> = {
    [K in keyof T]-?: T[K] extends SomeObject ? RequiredDeepObject<T[K]> : T[K]
}
