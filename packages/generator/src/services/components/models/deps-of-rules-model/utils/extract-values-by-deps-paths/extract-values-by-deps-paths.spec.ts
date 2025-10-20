import { extractValuesByDepsPaths } from './index'

describe('extractValuesByDepsPaths', () => {
    describe('when extracting all values ​​by paths', () => {
        it('return all values ​​by paths without nesting', () => {
            expect(extractValuesByDepsPaths({ a: 'a' }, [['a']])).toEqual(new Set(['a']))
            expect(extractValuesByDepsPaths({ a: 'a', b: 'b' }, [['a'], ['b']])).toEqual(new Set(['a', 'b']))
            expect(extractValuesByDepsPaths({ b: { c: 'c' } }, [['b', 'c']])).toEqual(new Set(['c']))
            expect(extractValuesByDepsPaths({ b: { c: { d: 'd' } } }, [['b', 'c', 'd']])).toEqual(new Set(['d']))
        })

        it('return all values ​​by paths with object nesting', () => {
            expect(
                extractValuesByDepsPaths({ b: { c: { d: 'd', t: { o: { x: 'x' } }, e: 'e', o: { g: 'g' } } } }, [
                    ['b', 'c', 'd'],
                    ['b', 'c', 't', 'o', 'x'],
                    ['b', 'c', 'o', 'g'],
                ]),
            ).toEqual(new Set(['d', 'x', 'g']))
        })

        it('return all values ​​by paths with array nesting', () => {
            expect(extractValuesByDepsPaths({ a: ['b', 'c', 'd'] }, [['a']])).toEqual(new Set(['b', 'c', 'd']))
            expect(extractValuesByDepsPaths({ a: [['b', 'c'], ['d']], x: [['z'], ['o', 'y']] }, [['a'], ['x']])).toEqual(
                new Set(['b', 'c', 'd', 'z', 'o', 'y']),
            )
            expect(extractValuesByDepsPaths({ a: [[[[['b', 'c']]]]] }, [['a']])).toEqual(new Set(['b', 'c']))
        })

        it('return all values ​​by paths with object & array nesting', () => {
            expect(
                extractValuesByDepsPaths(
                    {
                        a: [{ b: 'b1' }, { b: 'b2' }, { b: 'b3' }],
                    },
                    [['a', 'b']],
                ),
            ).toEqual(new Set(['b1', 'b2', 'b3']))
            expect(
                extractValuesByDepsPaths(
                    {
                        a: [
                            { b: 'b1', c: [{ e: 'e11' }, { e: 'e12' }] },
                            { b: 'b2', c: [{ e: 'e21' }, { e: 'e22' }] },
                        ],
                    },
                    [
                        ['a', 'b'],
                        ['a', 'c', 'e'],
                    ],
                ),
            ).toEqual(new Set(['b1', 'b2', 'e11', 'e12', 'e21', 'e22']))
            expect(
                extractValuesByDepsPaths(
                    {
                        a: { b: [{ p: 'p', h: [[[[{ t: 't1' }]], [[{ t: 't2' }]]]] }], x: ['q'] },
                        z: [
                            { f: { l: 'l1', k: ['d1', 'v1'], g: [{ e: 'e1' }] } },
                            { f: { l: 'l2', k: ['d2', 'v2'], g: [{ e: 'e21' }, { e: 'e22' }, { e: 'e23' }] } },
                            { f: { l: 'l3', k: ['d3', 'v3'], g: [{ e: 'e3' }] } },
                        ],
                    },
                    [
                        ['a', 'b', 'p'],
                        ['a', 'b', 'h', 't'],
                        ['a', 'x'],
                        ['z', 'f', 'l'],
                        ['z', 'f', 'k'],
                        ['z', 'f', 'g', 'e'],
                    ],
                ),
            ).toEqual(new Set(['p', 't1', 't2', 'q', 'l1', 'l2', 'l3', 'd1', 'd2', 'd3', 'v1', 'v2', 'v3', 'e1', 'e21', 'e22', 'e23', 'e3']))
        })
    })

    it('return all values ​​that were found', () => {
        expect(
            extractValuesByDepsPaths(
                {
                    a: 'a',
                    b: { c: { s: 's' }, d: 'd' },
                    t: { y: 'y' },
                },
                [['a'], ['a', 'c', 'd'], ['b', 'd'], ['b', 'c', 's', 'z'], ['b', 'c'], ['t', 'y', 'e']],
            ),
        ).toEqual(new Set(['a', 'd']))
    })

    it('return all found values ​​of type string', () => {
        expect(
            extractValuesByDepsPaths(
                {
                    a: undefined,
                    b: { o: null, c: { s: [1, 2, 3] }, d: [true, false] },
                    t: { y: 'y' },
                },
                [['a'], ['b', 'o'], ['b', 'c', 's'], ['b', 'd'], ['t', 'y']],
            ),
        ).toEqual(new Set(['y']))
    })

    it('return only unique values', () => {
        expect(extractValuesByDepsPaths({ a: ['b'], c: 'b' }, [['a'], ['c']])).toEqual(new Set(['b']))
        expect(extractValuesByDepsPaths({ a: ['b', 'b', 'b'], c: ['x', 'x'] }, [['a'], ['c']])).toEqual(new Set(['b', 'x']))
        expect(extractValuesByDepsPaths({ a: ['b'] }, [['a'], ['a'], ['a']])).toEqual(new Set(['b']))
        expect(extractValuesByDepsPaths({ a: ['b', 'b', 'b'] }, [['a'], ['a'], ['a']])).toEqual(new Set(['b']))
    })

    describe('when extracting empty values', () => {
        it('return empty if all args are empty', () => {
            expect(extractValuesByDepsPaths({}, [])).toEqual(new Set([]))
            expect(extractValuesByDepsPaths({}, [[]])).toEqual(new Set([]))
            expect(extractValuesByDepsPaths({}, [[], []])).toEqual(new Set([]))
        })

        it('return empty if "paths" arg is empty', () => {
            expect(extractValuesByDepsPaths({ a: 'a', b: { ba: 'ba', bb: 'bb' } }, [])).toEqual(new Set([]))
        })

        it('return empty if "targetObj" arg is empty', () => {
            expect(extractValuesByDepsPaths({}, [['a']])).toEqual(new Set([]))
            expect(extractValuesByDepsPaths({}, [['a', 'b']])).toEqual(new Set([]))
            expect(extractValuesByDepsPaths({}, [['a'], ['c']])).toEqual(new Set([]))
            expect(extractValuesByDepsPaths({}, [['a'], ['c', 'd']])).toEqual(new Set([]))
            expect(extractValuesByDepsPaths({}, [['a'], []])).toEqual(new Set([]))
            expect(extractValuesByDepsPaths({}, [[], ['a']])).toEqual(new Set([]))
        })

        it('return empty if no paths found', () => {
            expect(extractValuesByDepsPaths({ a: 'a' }, [['a', 'b']])).toEqual(new Set([]))
            expect(extractValuesByDepsPaths({ a: { b: { c: 'c' } } }, [['a', 'b']])).toEqual(new Set([]))
        })

        it('return empty if paths found but no string type', () => {
            expect(extractValuesByDepsPaths({ a: 1 }, [['a']])).toEqual(new Set([]))
            expect(extractValuesByDepsPaths({ a: null }, [['a']])).toEqual(new Set([]))
            expect(extractValuesByDepsPaths({ a: undefined }, [['a']])).toEqual(new Set([]))
            expect(extractValuesByDepsPaths({ a: [[]] }, [['a']])).toEqual(new Set([]))
            expect(extractValuesByDepsPaths({ a: [1] }, [['a']])).toEqual(new Set([]))
            expect(extractValuesByDepsPaths({ a: [null] }, [['a']])).toEqual(new Set([]))
            expect(extractValuesByDepsPaths({ a: true }, [['a']])).toEqual(new Set([]))
        })
    })
})
