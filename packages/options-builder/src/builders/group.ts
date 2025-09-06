import { AvailableObject, Undefinable, Unwrap } from '@form-crafter/utils'

import { GroupStruct, OutputFromGroupStruct } from '../types'
import { GeneralOptionBuilder } from './general'

type Properties = {
    label: Undefinable<string>
}

const getInitialProperties = (): Properties => ({
    label: undefined,
})

export class GroupBuilder<
    Output extends Undefinable<AvailableObject> = Undefinable<AvailableObject>,
    Struct extends GroupStruct = GroupStruct,
> extends GeneralOptionBuilder<Output, Properties> {
    public struct: Struct = Object.create(null)

    constructor(struct: Struct) {
        super({ type: 'group', properties: getInitialProperties() })
        this.setStruct(struct)
    }

    public label(value: Properties['label']) {
        this.properties.label = value
        return this
    }

    public hideIf() {
        this.mutations.push({ name: 'hideIf' })
        return this
    }

    private setStruct(struct: Struct) {
        this.struct = struct
    }

    protected cast() {
        console.log(this.struct)
    }
}

export const group = <T extends GroupStruct>(struct: T) => {
    type Output = Unwrap<OutputFromGroupStruct<T>>

    return new GroupBuilder<Output, T>(struct)
}
