import { sample } from 'effector'

import { Params } from '.'

export const initRemoveComponents = ({ repeaterModel, componentsRegistryModel, viewsService }: Params) => {
    sample({
        clock: repeaterModel.groupToRemove,
        fn: ({ repeaterId, rowIndex }) => ({ componentId: repeaterId, rowIndex }),
        target: viewsService.removeRowElementDeep,
    })

    sample({
        clock: viewsService.resultOfCalcRemoveRowElementDeep,
        fn: ({ componentsIdsToRemove }) => componentsIdsToRemove,
        target: componentsRegistryModel.removeComponentsModels,
    })

    // TODO Удалить ошибки, готовые правила валидаций и возможно что-нибудь ещё.
}
