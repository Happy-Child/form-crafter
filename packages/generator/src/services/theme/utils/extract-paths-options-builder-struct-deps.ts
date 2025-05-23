import { GroupOptionsBuilder, isComponentOptionsBuilder, isGroupOptionsBuilder, MultifieldOptionsBuilder, OptionsBuilder } from '@form-crafter/core'

const isMultifieldOptionsBuilder = (builder: OptionsBuilder): builder is MultifieldOptionsBuilder => builder.type === 'multifield'

export const extractPathsOptionsBuilderStructDeps = (struct: GroupOptionsBuilder['struct'], path: string[] = []): string[][] => {
    const structEntries = Object.entries(struct)
    const result: string[][] = []

    structEntries.forEach(([key, builder]) => {
        if (isGroupOptionsBuilder(builder)) {
            const childPaths = extractPathsOptionsBuilderStructDeps(builder.struct, [...path, key])
            result.push(...childPaths)
        } else if (isMultifieldOptionsBuilder(builder)) {
            const childPaths = extractPathsOptionsBuilderStructDeps(builder.properties.template, [...path, key])
            result.push(...childPaths)
        } else if (isComponentOptionsBuilder(builder)) {
            result.push([...path, key])
        }
    })

    return result
}
