import { buildFlattenGraphAndFindCycles } from '.'

describe('buildFlattenGraphAndFindCycles', () => {
    it('should be build correct flatten graph', () => {
        const graph = {
            a: ['b', 'c', 'd'],
            b: ['x', 'c'],
            c: ['z', 'k', 'd'],
            k: ['d'],
            t: [],
            o: [],
        }

        const result = buildFlattenGraphAndFindCycles(graph)

        expect(result).toEqual({
            flattenGraph: {
                a: ['b', 'x', 'c', 'z', 'k', 'd'],
                b: ['x', 'c', 'z', 'k', 'd'],
                c: ['z', 'k', 'd'],
                k: ['d'],
            },
            cycles: [],
            hasCycle: false,
        })
    })

    it('should give the same result with different key orders', () => {
        const result1 = buildFlattenGraphAndFindCycles({
            a: ['b'],
            c: ['b', 'a'],
            b: [],
        })
        const result2 = buildFlattenGraphAndFindCycles({
            c: ['b', 'a'],
            b: [],
            a: ['b'],
        })

        expect(result1).toEqual({
            flattenGraph: {
                a: ['b'],
                c: ['b', 'a'],
            },
            cycles: [],
            hasCycle: false,
        })
        expect(result2).toEqual({
            flattenGraph: {
                a: ['b'],
                c: ['b', 'a'],
            },
            cycles: [],
            hasCycle: false,
        })
    })

    it('should be found cycles', () => {
        const result1 = buildFlattenGraphAndFindCycles({
            a: ['b', 'c', 'd'],
            b: ['x', 'c'],
            c: ['z', 'k', 'd'],
            k: ['d'],
            d: ['a'],
        })
        expect(result1).toEqual({
            flattenGraph: {
                a: ['b', 'x', 'c', 'z', 'k', 'd', 'a'],
                b: ['x', 'c', 'z', 'k', 'd', 'a'],
                c: ['z', 'k', 'd', 'a'],
                k: ['d', 'a'],
                d: ['a'],
            },
            cycles: [['a', 'b', 'c', 'k', 'd', 'a']],
            hasCycle: true,
        })

        const result2 = buildFlattenGraphAndFindCycles({
            a: ['a'],
        })
        expect(result2).toEqual({
            flattenGraph: {
                a: ['a'],
            },
            cycles: [['a', 'a']],
            hasCycle: true,
        })
    })

    it('should be found cycles', () => {
        const graph = {
            a: ['b', 'c', 'd'],
            b: ['x', 'c'],
            c: ['z', 'a', 'k', 'd'],
            k: ['d'],
            d: ['a'],
        }

        const result = buildFlattenGraphAndFindCycles(graph)

        expect(result).toEqual({
            flattenGraph: {
                a: ['b', 'x', 'c', 'z', 'a', 'k', 'd'],
                b: ['x', 'c', 'z', 'a', 'k', 'd'],
                c: ['z', 'a', 'k', 'd'],
                k: ['d', 'a'],
                d: ['a'],
            },
            cycles: [
                ['a', 'b', 'c', 'a'],
                ['a', 'b', 'c', 'k', 'd', 'a'],
            ],
            hasCycle: true,
        })
    })

    it('should be return empty', () => {
        const emptyResult = {
            flattenGraph: {},
            cycles: [],
            hasCycle: false,
        }

        const result1 = buildFlattenGraphAndFindCycles({
            a: [],
            b: [],
            c: [],
            k: [],
            d: [],
        })
        expect(result1).toEqual(emptyResult)

        const result2 = buildFlattenGraphAndFindCycles({})
        expect(result2).toEqual(emptyResult)
    })
})
