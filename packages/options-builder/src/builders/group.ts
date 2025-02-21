import { OptionalSerializableObject, Undefinable, Unwrap } from '@form-crafter/utils'

import { GroupStruct, GroupStructFromOutput, OutputFromGroupStruct } from '../types'
import { GeneralOptionBuilder } from './general'

type Properties = {
    label: Undefinable<string>
}

const getInitialProperties = (): Properties => ({
    label: undefined,
})

export class GroupBuilder<Output extends Undefinable<OptionalSerializableObject> = Undefinable<OptionalSerializableObject>> extends GeneralOptionBuilder<
    Output,
    Properties
> {
    private struct: GroupStructFromOutput<NonNullable<Output>> = Object.create(null)

    constructor(struct: GroupStructFromOutput<Output>) {
        super({ type: 'group', properties: getInitialProperties() })
        this.setStruct(struct)
    }

    public label(value: Properties['label']) {
        this.properties.label = value
        return this
    }

    public hideIf() {
        this.relations.push({ name: 'hideIf' })
        return this
    }

    private setStruct<T extends Output>(struct: GroupStructFromOutput<T>) {
        this.struct = struct as GroupStructFromOutput<NonNullable<Output>>
    }

    protected cast() {
        console.log(this.struct)
    }
}

export const group = <T extends GroupStruct>(struct: T) => {
    type Output = Unwrap<OutputFromGroupStruct<T>>

    return new GroupBuilder<Output>(struct as GroupStructFromOutput<Output>)
}
