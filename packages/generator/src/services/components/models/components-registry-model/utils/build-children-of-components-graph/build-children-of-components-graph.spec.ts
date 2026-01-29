import { ComponentsSchemas, ViewElementsGraph } from '@form-crafter/core'

import { ComponentsTemplates } from '../../models/components-templates-model'
import { buildChildrenComponentsGraph } from '.'

describe('buildChildrenComponentsGraph', () => {
    it('build simple children components graph', () => {
        const compsSchemas = {
            repeater: {
                meta: {
                    type: 'repeater',
                },
            },
            repeater_container_1: {
                meta: {
                    type: 'container',
                },
            },
            repeater_container_2: {
                meta: {
                    type: 'container',
                },
            },
        } as unknown as ComponentsSchemas

        // View:
        // repeater
        //   - container
        //     - input
        //     - input
        //   - container
        //     - input
        //     - input
        const currentViewElementsGraph: ViewElementsGraph = {
            rows: {
                root: ['row'],
                graph: {
                    row: {
                        id: 'row',
                        parentComponentId: null,
                        childrenComponents: ['repeater'],
                    },
                    repeater_row_1: {
                        id: 'repeater_row_1',
                        parentComponentId: 'repeater',
                        childrenComponents: ['repeater_container_1'],
                    },
                    repeater_row_2: {
                        id: 'repeater_row_2',
                        parentComponentId: 'repeater',
                        childrenComponents: ['repeater_container_2'],
                    },
                    repeater_container_1_row: {
                        id: 'repeater_container_1_row',
                        parentComponentId: 'repeater_container_1',
                        childrenComponents: ['repeater_container_1_component_1', 'repeater_container_1_component_2'],
                    },
                    repeater_container_2_row: {
                        id: 'repeater_container_2_row',
                        parentComponentId: 'repeater_container_2',
                        childrenComponents: ['repeater_container_2_component_1', 'repeater_container_2_component_2'],
                    },
                },
            },
            components: {
                repeater: {
                    id: 'repeater',
                    parentRowId: 'row',
                    childrenRows: ['repeater_row_1', 'repeater_row_2'],
                    layout: { col: 'auto' },
                },
                repeater_container_1: {
                    id: 'repeater_container_1',
                    parentRowId: 'repeater_row_1',
                    childrenRows: ['repeater_container_1_row'],
                    layout: { col: 'auto' },
                },
                repeater_container_2: {
                    id: 'repeater_container_2',
                    parentRowId: 'repeater_row_2',
                    childrenRows: ['repeater_container_2_row'],
                    layout: { col: 'auto' },
                },
                repeater_container_1_component_1: {
                    id: 'repeater_container_1_component_1',
                    parentRowId: 'repeater_container_1_row',
                    childrenRows: [],
                    layout: { col: 'auto' },
                },
                repeater_container_1_component_2: {
                    id: 'repeater_container_1_component_2',
                    parentRowId: 'repeater_container_1_row',
                    childrenRows: [],
                    layout: { col: 'auto' },
                },
                repeater_container_2_component_1: {
                    id: 'repeater_container_2_component_1',
                    parentRowId: 'repeater_container_2_row',
                    childrenRows: [],
                    layout: { col: 'auto' },
                },
                repeater_container_2_component_2: {
                    id: 'repeater_container_2_component_2',
                    parentRowId: 'repeater_container_2_row',
                    childrenRows: [],
                    layout: { col: 'auto' },
                },
            },
        }
        const componentIdToTemplateId: ComponentsTemplates['componentIdToTemplateId'] = {
            repeater_container_1: 'container_template',
            repeater_container_2: 'container_template',
            repeater_container_1_component_1: 'component_template_1',
            repeater_container_1_component_2: 'component_template_2',
            repeater_container_2_component_1: 'component_template_1',
            repeater_container_2_component_2: 'component_template_2',
        }

        const result = buildChildrenComponentsGraph(compsSchemas, currentViewElementsGraph, componentIdToTemplateId)

        expect(result).toEqual({
            repeater: {
                type: 'repeater',
                children: new Set(['repeater_container_1', 'repeater_container_2']),
            },
            repeater_container_1: {
                type: 'container',
                children: new Set(['repeater_container_1_component_1', 'repeater_container_1_component_2']),
                childrenByTemplateId: { component_template_1: 'repeater_container_1_component_1', component_template_2: 'repeater_container_1_component_2' },
            },
            repeater_container_2: {
                type: 'container',
                children: new Set(['repeater_container_2_component_1', 'repeater_container_2_component_2']),
                childrenByTemplateId: { component_template_1: 'repeater_container_2_component_1', component_template_2: 'repeater_container_2_component_2' },
            },
        })
    })

    it('build deep children components graph', () => {
        const compsSchemas = {
            repeater: {
                meta: {
                    type: 'repeater',
                },
            },
            repeater_container_1: {
                meta: {
                    type: 'container',
                },
            },
            repeater_container_1_component_2: {
                meta: {
                    type: 'container',
                },
            },
            repeater_container_2_component_3: {
                meta: {
                    type: 'repeater',
                },
            },
            repeater_container_2_component_3_container_1: {
                meta: {
                    type: 'container',
                },
            },
            repeater_container_2_component_3_container_2: {
                meta: {
                    type: 'container',
                },
            },
        } as unknown as ComponentsSchemas

        // View:
        // repeater
        //   - container
        //     - input
        //     - container
        //       - input
        //     - repeater
        //       - container
        //         - input
        //       - container
        //         - input
        const currentViewElementsGraph: ViewElementsGraph = {
            rows: {
                root: ['row'],
                graph: {
                    row: {
                        id: 'row',
                        parentComponentId: null,
                        childrenComponents: ['repeater'],
                    },
                    repeater_row_1: {
                        id: 'repeater_row_1',
                        parentComponentId: 'repeater',
                        childrenComponents: ['repeater_container_1'],
                    },
                    repeater_container_1_row_1: {
                        id: 'repeater_container_1_row',
                        parentComponentId: 'repeater_container_1',
                        childrenComponents: ['repeater_container_1_component_1', 'repeater_container_1_component_2'],
                    },
                    repeater_container_1_row_2: {
                        id: 'repeater_container_2_row',
                        parentComponentId: 'repeater_container_1',
                        childrenComponents: ['repeater_container_2_component_3'],
                    },
                    repeater_container_1_component_2_row_1: {
                        id: 'repeater_container_1_component_2_row_1',
                        parentComponentId: 'repeater_container_1_component_2',
                        childrenComponents: ['repeater_container_1_component_2_component_1'],
                    },
                    repeater_container_2_component_3_row_1: {
                        id: 'repeater_container_2_component_3_row_1',
                        parentComponentId: 'repeater_container_2_component_3',
                        childrenComponents: ['repeater_container_2_component_3_container_1'],
                    },
                    repeater_container_2_component_3_row_2: {
                        id: 'repeater_container_2_component_3_row_2',
                        parentComponentId: 'repeater_container_2_component_3',
                        childrenComponents: ['repeater_container_2_component_3_container_2'],
                    },
                    repeater_container_2_component_3_container_1_row_1: {
                        id: 'repeater_container_2_component_3_container_1_row_1',
                        parentComponentId: 'repeater_container_2_component_3_container_1',
                        childrenComponents: ['repeater_container_2_component_3_container_1_component_1'],
                    },
                    repeater_container_2_component_3_container_2_row_1: {
                        id: 'repeater_container_2_component_3_container_2_row_1',
                        parentComponentId: 'repeater_container_2_component_3_container_2',
                        childrenComponents: ['repeater_container_2_component_3_container_2_component_1'],
                    },
                },
            },
            components: {
                repeater: {
                    id: 'repeater',
                    parentRowId: 'row',
                    childrenRows: ['repeater_row_1'],
                    layout: { col: 'auto' },
                },
                repeater_container_1: {
                    id: 'repeater_container_1',
                    parentRowId: 'repeater_row_1',
                    childrenRows: ['repeater_container_1_row_1', 'repeater_container_1_row_2'],
                    layout: { col: 'auto' },
                },
                repeater_container_1_component_1: {
                    id: 'repeater_container_1_component_1',
                    parentRowId: 'repeater_container_1_row_1',
                    layout: { col: 'auto' },
                },
                repeater_container_1_component_2: {
                    id: 'repeater_container_1_component_2',
                    parentRowId: 'repeater_container_1_row_1',
                    childrenRows: ['repeater_container_1_component_2_row_1'],
                    layout: { col: 'auto' },
                },
                repeater_container_1_component_2_component_1: {
                    id: 'repeater_container_1_component_2_component_1',
                    parentRowId: 'repeater_container_1_component_2_row_1',
                    childrenRows: [],
                    layout: { col: 'auto' },
                },
                repeater_container_2_component_3: {
                    id: 'repeater_container_2_component_3',
                    parentRowId: 'repeater_container_1_row_2',
                    childrenRows: ['repeater_container_2_component_3_row_1', 'repeater_container_2_component_3_row_2'],
                    layout: { col: 'auto' },
                },
                repeater_container_2_component_3_container_1: {
                    id: 'repeater_container_2_component_3_container_1',
                    parentRowId: 'repeater_container_2_component_3_row_1',
                    childrenRows: ['repeater_container_2_component_3_container_1_row_1'],
                    layout: { col: 'auto' },
                },
                repeater_container_2_component_3_container_2: {
                    id: 'repeater_container_2_component_3_container_2',
                    parentRowId: 'repeater_container_2_component_3_row_2',
                    childrenRows: ['repeater_container_2_component_3_container_2_row_1'],
                    layout: { col: 'auto' },
                },
                repeater_container_2_component_3_container_1_component_1: {
                    id: 'repeater_container_2_component_3_container_1_component_1',
                    parentRowId: 'repeater_container_2_component_3_container_1_row_1',
                    childrenRows: [],
                    layout: { col: 'auto' },
                },
                repeater_container_2_component_3_container_2_component_1: {
                    id: 'repeater_container_2_component_3_container_2_component_1',
                    parentRowId: 'repeater_container_2_component_3_container_1_row_2',
                    childrenRows: [],
                    layout: { col: 'auto' },
                },
            },
        }
        const componentIdToTemplateId: ComponentsTemplates['componentIdToTemplateId'] = {
            repeater_container_1: 'repeater_1_container_template',
            repeater_container_2_component_3_container_1: 'repeater_2_container_template',
            repeater_container_2_component_3_container_2: 'repeater_2_container_template',
            repeater_container_1_component_1: 'repeater_1_component_1_template',
            repeater_container_1_component_2: 'repeater_1_component_2_template',
            repeater_container_2_component_3: 'repeater_1_component_3_template',
            repeater_container_1_component_2_component_1: 'repeater_1_component_4_template',
            repeater_container_2_component_3_container_1_component_1: 'repeater_2_component_1_template',
            repeater_container_2_component_3_container_2_component_1: 'repeater_2_component_1_template',
        }

        const result = buildChildrenComponentsGraph(compsSchemas, currentViewElementsGraph, componentIdToTemplateId)

        expect(result).toEqual({
            repeater: {
                type: 'repeater',
                children: new Set(['repeater_container_1']),
            },
            repeater_container_1: {
                type: 'container',
                children: new Set(['repeater_container_1_component_1', 'repeater_container_1_component_2', 'repeater_container_2_component_3']),
                childrenByTemplateId: {
                    repeater_1_component_1_template: 'repeater_container_1_component_1',
                    repeater_1_component_2_template: 'repeater_container_1_component_2',
                    repeater_1_component_3_template: 'repeater_container_2_component_3',
                },
            },
            repeater_container_1_component_2: {
                type: 'container',
                children: new Set(['repeater_container_1_component_2_component_1']),
                childrenByTemplateId: {
                    repeater_1_component_4_template: 'repeater_container_1_component_2_component_1',
                },
            },
            repeater_container_2_component_3: {
                type: 'repeater',
                children: new Set(['repeater_container_2_component_3_container_1', 'repeater_container_2_component_3_container_2']),
            },
            repeater_container_2_component_3_container_1: {
                type: 'container',
                children: new Set(['repeater_container_2_component_3_container_1_component_1']),
                childrenByTemplateId: {
                    repeater_2_component_1_template: 'repeater_container_2_component_3_container_1_component_1',
                },
            },
            repeater_container_2_component_3_container_2: {
                type: 'container',
                children: new Set(['repeater_container_2_component_3_container_2_component_1']),
                childrenByTemplateId: {
                    repeater_2_component_1_template: 'repeater_container_2_component_3_container_2_component_1',
                },
            },
        })
    })

    it('build empty children components graph', () => {
        const compsSchemas = {
            repeater: {
                meta: {
                    type: 'repeater',
                },
            },
            repeater_container_1: {
                meta: {
                    type: 'container',
                },
            },
            repeater_container_2: {
                meta: {
                    type: 'container',
                },
            },
        } as unknown as ComponentsSchemas

        // View:
        // repeater
        // container
        const currentViewElementsGraph: ViewElementsGraph = {
            rows: {
                root: ['row'],
                graph: {
                    row: {
                        id: 'row',
                        parentComponentId: null,
                        childrenComponents: ['repeater', 'container'],
                    },
                },
            },
            components: {
                repeater: {
                    id: 'repeater',
                    parentRowId: 'row',
                    childrenRows: [],
                    layout: { col: 'auto' },
                },
                container: {
                    id: 'container',
                    parentRowId: 'row',
                    childrenRows: [],
                    layout: { col: 'auto' },
                },
            },
        }
        const componentIdToTemplateId: ComponentsTemplates['componentIdToTemplateId'] = {}

        const result = buildChildrenComponentsGraph(compsSchemas, currentViewElementsGraph, componentIdToTemplateId)

        expect(result).toEqual({})
    })

    it('build empty children components graph when have no children', () => {
        const compsSchemas: ComponentsSchemas = {}

        const currentViewElementsGraph: ViewElementsGraph = {
            rows: {
                root: [],
                graph: {},
            },
            components: {},
        }
        const componentIdToTemplateId: ComponentsTemplates['componentIdToTemplateId'] = {}

        const result = buildChildrenComponentsGraph(compsSchemas, currentViewElementsGraph, componentIdToTemplateId)

        expect(result).toEqual({})
    })
})
