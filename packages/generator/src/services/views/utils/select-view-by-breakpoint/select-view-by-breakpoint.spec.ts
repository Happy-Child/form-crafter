import { ResponsiveViewElementsGraph } from '../../types'
import { selectViewByBreakpoint } from '.'

const initialResponsiveView: ResponsiveViewElementsGraph = {
    xxl: {
        rows: {
            root: ['rowXxl'],
            graph: {
                row1: {
                    id: 'rowXxl',
                    parentComponentId: null,
                    childrenComponents: ['component'],
                },
            },
        },
        components: {
            component: {
                id: 'component',
                parentRowId: 'rowXxl',
                childrenRows: [],
                layout: { col: 'auto' },
            },
        },
    },
    xl: {
        rows: {
            root: ['rowXl'],
            graph: {
                row1: {
                    id: 'rowXl',
                    parentComponentId: null,
                    childrenComponents: ['component'],
                },
            },
        },
        components: {
            component: {
                id: 'component',
                parentRowId: 'rowXl',
                childrenRows: [],
                layout: { col: 'auto' },
            },
        },
    },
    lg: {
        rows: {
            root: ['rowLg'],
            graph: {
                row1: {
                    id: 'rowLg',
                    parentComponentId: null,
                    childrenComponents: ['component'],
                },
            },
        },
        components: {
            component: {
                id: 'component',
                parentRowId: 'rowLg',
                childrenRows: [],
                layout: { col: 'auto' },
            },
        },
    },
    md: {
        rows: {
            root: ['rowMd'],
            graph: {
                row1: {
                    id: 'rowMd',
                    parentComponentId: null,
                    childrenComponents: ['component'],
                },
            },
        },
        components: {
            component: {
                id: 'component',
                parentRowId: 'rowMd',
                childrenRows: [],
                layout: { col: 'auto' },
            },
        },
    },
    sm: {
        rows: {
            root: ['rowSm'],
            graph: {
                row1: {
                    id: 'rowSm',
                    parentComponentId: null,
                    childrenComponents: ['component'],
                },
            },
        },
        components: {
            component: {
                id: 'component',
                parentRowId: 'rowSm',
                childrenRows: [],
                layout: { col: 'auto' },
            },
        },
    },
    xs: {
        rows: {
            root: ['rowXs'],
            graph: {
                row1: {
                    id: 'rowXs',
                    parentComponentId: null,
                    childrenComponents: ['component'],
                },
            },
        },
        components: {
            component: {
                id: 'component',
                parentRowId: 'rowXs',
                childrenRows: [],
                layout: { col: 'auto' },
            },
        },
    },
}

describe('selectViewByBreakpoint', () => {
    it('existing view is selected', () => {
        const responsiveView = { ...initialResponsiveView }

        expect(selectViewByBreakpoint('xxl', responsiveView)).toEqual(responsiveView.xxl)
        expect(selectViewByBreakpoint('xl', responsiveView)).toEqual(responsiveView.xl)
        expect(selectViewByBreakpoint('lg', responsiveView)).toEqual(responsiveView.lg)
        expect(selectViewByBreakpoint('md', responsiveView)).toEqual(responsiveView.md)
        expect(selectViewByBreakpoint('sm', responsiveView)).toEqual(responsiveView.sm)
        expect(selectViewByBreakpoint('xs', responsiveView)).toEqual(responsiveView.xs)
    })

    it('closest view is selected if there is no selected one', () => {
        const responsiveView = { ...initialResponsiveView }
        delete responsiveView.lg
        delete responsiveView.xs

        expect(selectViewByBreakpoint('lg', responsiveView)).toEqual(responsiveView.xl)
        expect(selectViewByBreakpoint('xs', responsiveView)).toEqual(responsiveView.sm)
    })

    it('xxl is selected if there is no type', () => {
        const responsiveView = { ...initialResponsiveView }
        delete responsiveView.xl
        delete responsiveView.lg
        delete responsiveView.md
        delete responsiveView.sm
        delete responsiveView.xs

        expect(selectViewByBreakpoint('xxl', responsiveView)).toEqual(responsiveView.xxl)
        expect(selectViewByBreakpoint('xl', responsiveView)).toEqual(responsiveView.xxl)
        expect(selectViewByBreakpoint('lg', responsiveView)).toEqual(responsiveView.xxl)
        expect(selectViewByBreakpoint('md', responsiveView)).toEqual(responsiveView.xxl)
        expect(selectViewByBreakpoint('sm', responsiveView)).toEqual(responsiveView.xxl)
        expect(selectViewByBreakpoint('xs', responsiveView)).toEqual(responsiveView.xxl)
    })
})
