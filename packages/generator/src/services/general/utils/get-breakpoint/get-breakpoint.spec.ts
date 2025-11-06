import { getBreakpoint } from '.'

describe('getBreakpoint', () => {
    it('should be correct extract elements', () => {
        expect(getBreakpoint(1601)).toEqual('xxl')
        expect(getBreakpoint(1600)).toEqual('xxl')

        expect(getBreakpoint(1599)).toEqual('xl')
        expect(getBreakpoint(1200)).toEqual('xl')

        expect(getBreakpoint(1199)).toEqual('lg')
        expect(getBreakpoint(992)).toEqual('lg')

        expect(getBreakpoint(991)).toEqual('md')
        expect(getBreakpoint(768)).toEqual('md')

        expect(getBreakpoint(767)).toEqual('sm')
        expect(getBreakpoint(576)).toEqual('sm')

        expect(getBreakpoint(575)).toEqual('xs')
        expect(getBreakpoint(0)).toEqual('xs')
    })
})
