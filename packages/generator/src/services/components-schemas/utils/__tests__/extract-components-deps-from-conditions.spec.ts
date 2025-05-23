import { extractComponentsDepsFromConditions } from '../extract-components-deps-from-conditions'
import { mockComponentSchema } from './mocks'

describe('extractComponentsDepsFromConditions', () => {
    it('should extract components deps from conditions 1', () => {
        const result = extractComponentsDepsFromConditions([], mockComponentSchema.email.relations!.options[0].condition!)

        expect(result).toEqual([['input-first-name', 'date-birth']])
    })

    it('should extract components deps from conditions 2', () => {
        const result = extractComponentsDepsFromConditions([], mockComponentSchema['input-last-name'].relations!.options[0].condition!)

        expect(result).toEqual([['input-salary']])
    })
})
