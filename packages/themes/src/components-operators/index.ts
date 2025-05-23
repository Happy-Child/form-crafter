import { afterDateOperator } from './after-date'
import { beforeDateOperator } from './before-date'
import { endsWithOperator } from './ends-with'
import { isEmptyOperator } from './is-empty'
import { isNotEmptyOperator } from './is-not-empty'
import { startsWithOperator } from './starts-with'

export const componentsOperators = {
    endsWithOperator,
    isEmptyOperator,
    isNotEmptyOperator,
    startsWithOperator,
    afterDateOperator,
    beforeDateOperator,
}
