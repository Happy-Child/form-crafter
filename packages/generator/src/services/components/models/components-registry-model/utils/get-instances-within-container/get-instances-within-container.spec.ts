import { ChildrenOfComponents } from '../../types'
import { getInstancesWithinContainer } from '.'

describe('getInstancesWithinContainer', () => {
    it('return all instances within repeater', () => {
        const childrenOfComponents: ChildrenOfComponents = {
            repeater: {
                type: 'repeater',
                children: new Set(['repeater_container_1', 'repeater_container_2']),
                childrenByTemplateId: { container_template: ['repeater_container_1', 'repeater_container_2'] },
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
        }

        expect(
            getInstancesWithinContainer({
                childrenOfComponents,
                containerId: 'repeater',
                targetTemplateId: 'container_template',
            }),
        ).toEqual(['repeater_container_1', 'repeater_container_2'])

        expect(
            getInstancesWithinContainer({
                childrenOfComponents,
                containerId: 'repeater',
                targetTemplateId: 'component_template_1',
            }),
        ).toEqual(['repeater_container_1_component_1', 'repeater_container_2_component_1'])
    })

    it('return all instances within container', () => {
        const childrenOfComponents: ChildrenOfComponents = {
            repeater: {
                type: 'repeater',
                children: new Set(['repeater_container_1', 'repeater_container_2']),
                childrenByTemplateId: { container_template: ['repeater_container_1', 'repeater_container_2'] },
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
        }

        expect(
            getInstancesWithinContainer({
                childrenOfComponents,
                containerId: 'repeater_container_1',
                targetTemplateId: 'component_template_1',
            }),
        ).toEqual(['repeater_container_1_component_1'])

        expect(
            getInstancesWithinContainer({
                childrenOfComponents,
                containerId: 'repeater_container_2',
                targetTemplateId: 'component_template_2',
            }),
        ).toEqual(['repeater_container_2_component_2'])
    })

    it('return empty instances within repeater & container', () => {
        const childrenOfComponents: ChildrenOfComponents = {
            repeater: {
                type: 'repeater',
                children: new Set(['repeater_container_1', 'repeater_container_2']),
                childrenByTemplateId: { container_template: ['repeater_container_1', 'repeater_container_2'] },
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
        }

        expect(
            getInstancesWithinContainer({
                childrenOfComponents,
                containerId: 'repeater',
                targetTemplateId: 'awesdf',
            }),
        ).toEqual([])

        expect(
            getInstancesWithinContainer({
                childrenOfComponents,
                containerId: 'repeater_container_1',
                targetTemplateId: 'rhtgerfsda',
            }),
        ).toEqual([])
    })
})
