import { ComponentsSchemas } from '@form-crafter/core'

import { DepsGraphAsSet } from '../../../../../../types'
import { buildReverseDepsGraph } from '../build-reverse-deps-graph'
import { extractValidationsSchemasConditionsDeps } from '../extract-validations-schemas-conditions-deps'
import { DepsByValidationRules } from './types'

export type { DepsByValidationRules }

export const extractComponentsValidationsConditionsDeps = (componentsSchemas: ComponentsSchemas): DepsByValidationRules => {
    let ruleIdToDepsComponents: DepsGraphAsSet = {}

    Object.values(componentsSchemas).forEach(({ validations }) => {
        ruleIdToDepsComponents = {
            ...ruleIdToDepsComponents,
            ...extractValidationsSchemasConditionsDeps(validations?.schemas),
        }
    })

    // TODO3
    // Кажется я могу тут сразу отсеть тех которых нету на текущем view И ТЕХ, у которых нет ни одной зависимости на текущем view

    // Может быть получиться это и перенести на выполнение мутаций по userAction

    // console.log('componentIdToDeps: ', componentIdToDeps)
    // филльр нужен по ключам и значениям. И ПРИДУМАТЬ ОЧЕНЬ РАЗНЫЕ ВИЬЮ, НО С ОБЩИМ НЕ БОЛЬШИМ КОЛИЧЕСТВАМ ПОЛЕЙ

    return {
        ruleIdToDepsComponents,
        componentsToDependentsRuleIds: buildReverseDepsGraph(ruleIdToDepsComponents),
    }
}
