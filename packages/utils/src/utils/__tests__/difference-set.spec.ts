import { differenceSet } from '../difference-set'

describe('differenceSet', () => {
    it('from set a you need to subtract set b', () => {
        const setA = new Set([1, 2, 3, 4, 5, 6])
        const setB = new Set([3, 6, 14, 522])

        const result = differenceSet(setA, setB)

        expect(result).toEqual(new Set([1, 2, 4, 5]))
    })

    it('set a should be empty after subtract set b', () => {
        const setA = new Set([3, 4])
        const setB = new Set([1, 2, 3, 4, 5, 6])

        const result = differenceSet(setA, setB)

        expect(result).toEqual(new Set())
    })
})
