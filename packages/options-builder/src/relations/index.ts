export type RelationRule = {
    name: string
    params?: object
}

export type RelationCondition = 'equal' | 'less' | 'more' | 'oneOf' | 'between' | 'empty' | 'notEmpty'
