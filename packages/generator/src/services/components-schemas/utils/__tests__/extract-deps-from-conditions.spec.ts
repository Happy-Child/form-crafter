import { extractDepsFromConditions } from '../extract-deps-from-conditions'
import { mockComponentSchema } from './mocks'

describe('extractDepsFromConditions', () => {
    it('should extract components deps from conditions 1', () => {
        const result = extractDepsFromConditions([], mockComponentSchema.email.relations!.options[0].condition!)

        expect(result).toEqual(['input-first-name', 'date-birth'])
    })

    it('should extract components deps from conditions 2', () => {
        const result = extractDepsFromConditions([], mockComponentSchema['input-last-name'].relations!.options[1].condition!)

        expect(result).toEqual(['input-salary'])
    })
})
