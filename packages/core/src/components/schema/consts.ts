import { MutationActivationStrategy, MutationRollbackStrategy } from './types'

export const defaultMutationRollbackStrategy: MutationRollbackStrategy = 'restore-initial'

export const defaultMutationActivationStrategy: MutationActivationStrategy = 'always'
