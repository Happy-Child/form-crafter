import { customAlphabet } from 'nanoid'

const alphabet = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@#%^?'
const nanoid = customAlphabet(alphabet, 10)

type Props = {
    prefix?: string
}

export const genId = ({ prefix }: Props) => {
    const id = nanoid()
    if (prefix?.length) {
        return `${prefix}_${id}`
    }
    return id
}
