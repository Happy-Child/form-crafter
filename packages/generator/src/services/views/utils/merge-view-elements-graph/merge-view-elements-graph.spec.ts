import { ResponsiveViewElementsGraph } from '../../types'
import { mergeViewElementsGraph } from '.'

const getResponsiveViewElementsGraph = (): ResponsiveViewElementsGraph => ({
    xxl: {
        rows: {
            root: ['row1', 'row2'],
            graph: {
                row1: {
                    id: 'row1',
                    parentComponentId: null,
                    childrenComponents: ['comp1'],
                },
                row2: {
                    id: 'row2',
                    parentComponentId: null,
                    childrenComponents: ['comp2', 'repeaterCompId'],
                },
            },
        },
        components: {
            comp1: {
                id: 'comp1',
                parentRowId: 'row1',
                childrenRows: [],
                layout: {
                    col: 'auto',
                },
            },
            comp2: {
                id: 'comp2',
                parentRowId: 'row2',
                childrenRows: [],
                layout: {
                    col: 12,
                },
            },
            repeaterCompId: {
                id: 'repeaterCompId',
                parentRowId: 'row2',
                childrenRows: [],
                layout: {
                    col: 'auto',
                },
            },
        },
    },
})

describe('mergeViewElementsGraph', () => {
    it('should be correct merge view elements graph', () => {
        const responsiveViewElementsGraph = getResponsiveViewElementsGraph()

        const responsiveViewToMerge: ResponsiveViewElementsGraph = {
            xxl: {
                rows: {
                    root: ['containerRootRowId'],
                    graph: {
                        containerRootRowId: {
                            id: 'containerRootRowId',
                            parentComponentId: null,
                            childrenComponents: ['comp4'],
                        },
                        row3: {
                            id: 'row3',
                            parentComponentId: 'comp4',
                            childrenComponents: ['comp5', 'comp6'],
                        },
                    },
                },
                components: {
                    comp4: {
                        id: 'comp4',
                        parentRowId: 'containerRootRowId',
                        childrenRows: ['row3'],
                        layout: {
                            col: 'auto',
                        },
                    },
                    comp5: {
                        id: 'comp5',
                        parentRowId: 'row3',
                        childrenRows: [],
                        layout: {
                            col: 12,
                        },
                    },
                    comp6: {
                        id: 'comp6',
                        parentRowId: 'row3',
                        childrenRows: [],
                        layout: {
                            col: 12,
                        },
                    },
                },
            },
        }

        const result = mergeViewElementsGraph({
            responsiveViewElementsGraph,
            responsiveViewToMerge,
            rootComponentId: 'repeaterCompId',
        })

        expect(result).toEqual({
            xxl: {
                rows: {
                    root: ['row1', 'row2'],
                    graph: {
                        row1: {
                            id: 'row1',
                            parentComponentId: null,
                            childrenComponents: ['comp1'],
                        },
                        row2: {
                            id: 'row2',
                            parentComponentId: null,
                            childrenComponents: ['comp2', 'repeaterCompId'],
                        },
                        containerRootRowId: {
                            id: 'containerRootRowId',
                            parentComponentId: 'repeaterCompId',
                            childrenComponents: ['comp4'],
                        },
                        row3: {
                            id: 'row3',
                            parentComponentId: 'comp4',
                            childrenComponents: ['comp5', 'comp6'],
                        },
                    },
                },
                components: {
                    comp1: {
                        id: 'comp1',
                        parentRowId: 'row1',
                        childrenRows: [],
                        layout: {
                            col: 'auto',
                        },
                    },
                    comp2: {
                        id: 'comp2',
                        parentRowId: 'row2',
                        childrenRows: [],
                        layout: {
                            col: 12,
                        },
                    },
                    repeaterCompId: {
                        id: 'repeaterCompId',
                        parentRowId: 'row2',
                        childrenRows: ['containerRootRowId'],
                        layout: {
                            col: 'auto',
                        },
                    },
                    comp4: {
                        id: 'comp4',
                        parentRowId: 'containerRootRowId',
                        childrenRows: ['row3'],
                        layout: {
                            col: 'auto',
                        },
                    },
                    comp5: {
                        id: 'comp5',
                        parentRowId: 'row3',
                        childrenRows: [],
                        layout: {
                            col: 12,
                        },
                    },
                    comp6: {
                        id: 'comp6',
                        parentRowId: 'row3',
                        childrenRows: [],
                        layout: {
                            col: 12,
                        },
                    },
                },
            },
        } as ResponsiveViewElementsGraph)
    })

    it('should be correct merge empty view elements graph', () => {
        const responsiveViewElementsGraph = getResponsiveViewElementsGraph()

        const result = mergeViewElementsGraph({
            responsiveViewElementsGraph,
            responsiveViewToMerge: { xxl: { rows: { root: [], graph: {} }, components: {} } },
            rootComponentId: '',
        })

        expect(result).toEqual(responsiveViewElementsGraph)
    })
})
