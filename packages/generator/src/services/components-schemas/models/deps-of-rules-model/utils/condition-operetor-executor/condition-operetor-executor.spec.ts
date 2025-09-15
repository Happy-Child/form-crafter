import { conditionOperetorExecutor } from '.'

describe('conditionOperetorExecutor', () => {
    describe('andOperatorExecutor', () => {
        it('return true when all <V>[] are true', () => {
            const andOperatorExecutor = conditionOperetorExecutor('and')

            expect(andOperatorExecutor([true])).toEqual(true)
            expect(andOperatorExecutor([true, true])).toEqual(true)
        })

        it('return false when one of <V>[] are false', () => {
            const andOperatorExecutor = conditionOperetorExecutor('and')

            expect(andOperatorExecutor([false])).toEqual(false)
            expect(andOperatorExecutor([true, false])).toEqual(false)
        })

        it('return true when <V>[] is empty', () => {
            const andOperatorExecutor = conditionOperetorExecutor('and')

            expect(andOperatorExecutor([])).toEqual(true)
        })
    })

    describe('orOperatorExecutor', () => {
        it('return true when one of <V>[] are true', () => {
            const orOperatorExecutor = conditionOperetorExecutor('or')

            expect(orOperatorExecutor([true])).toEqual(true)
            expect(orOperatorExecutor([true, false])).toEqual(true)
        })

        it('return false when all <V>[] are false', () => {
            const orOperatorExecutor = conditionOperetorExecutor('or')

            expect(orOperatorExecutor([false])).toEqual(false)
            expect(orOperatorExecutor([false, false])).toEqual(false)
        })

        it('return false when <V>[] is empty', () => {
            const orOperatorExecutor = conditionOperetorExecutor('or')

            expect(orOperatorExecutor([])).toEqual(false)
        })
    })

    describe('nandOperatorExecutor', () => {
        it('return false when all <V>[] are true', () => {
            const nandOperatorExecutor = conditionOperetorExecutor('nand')

            expect(nandOperatorExecutor([true])).toEqual(false)
            expect(nandOperatorExecutor([true, true])).toEqual(false)
        })

        it('return true when one of <V>[] are false', () => {
            const nandOperatorExecutor = conditionOperetorExecutor('nand')

            expect(nandOperatorExecutor([false])).toEqual(true)
            expect(nandOperatorExecutor([true, false])).toEqual(true)
        })

        it('return false when <V>[] is empty', () => {
            const nandOperatorExecutor = conditionOperetorExecutor('nand')

            expect(nandOperatorExecutor([])).toEqual(false)
        })
    })

    describe('norOperatorExecutor', () => {
        it('return false when one of <V>[] are true', () => {
            const norOperatorExecutor = conditionOperetorExecutor('nor')

            expect(norOperatorExecutor([true])).toEqual(false)
            expect(norOperatorExecutor([true, false])).toEqual(false)
        })

        it('return true when all <V>[] are false', () => {
            const norOperatorExecutor = conditionOperetorExecutor('nor')

            expect(norOperatorExecutor([false])).toEqual(true)
            expect(norOperatorExecutor([false, false])).toEqual(true)
        })

        it('return true when <V>[] is empty', () => {
            const norOperatorExecutor = conditionOperetorExecutor('nor')

            expect(norOperatorExecutor([])).toEqual(true)
        })
    })
})
