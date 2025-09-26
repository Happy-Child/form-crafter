import { ComponentValidationError, EntityId } from '@form-crafter/core'

export const isErrorsDifferent = <T extends Pick<ComponentValidationError, 'id' | 'message'>>(errorsA: Map<EntityId, T>, errorsB: Map<EntityId, T>) => {
    if (errorsA.size !== errorsB.size) {
        return true
    }

    const arrA = Array.from(errorsA.values())
    const arrB = Array.from(errorsB.values())

    for (let i = 0; i < arrB.length; i++) {
        const errA = arrA[i]
        const errB = arrB[i]

        const messagesIsEquel = errA.message === errB.message
        const idsIsEquel = errA.id === errB.id

        if (!messagesIsEquel || !idsIsEquel) {
            return true
        }
    }

    return false
}
