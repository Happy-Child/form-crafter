import { readonly } from 'patronum'

import { ComponentsRegistryModel } from '../../../components-registry-model'
import { ComponentsValidationRuleSchemas } from './types'

type Params = {
    componentsRegistryModel: Pick<ComponentsRegistryModel, 'componentsStoreModel'>
}

export const createComponentsValidationSchemasModel = ({ componentsRegistryModel }: Params) => {
    const $schemas = readonly(
        componentsRegistryModel.componentsStoreModel.$componentsSchemas.map((componentsSchemas) =>
            Object.entries(componentsSchemas).reduce<ComponentsValidationRuleSchemas>((map, [ownerComponentId, componentSchema]) => {
                componentSchema?.validations?.schemas.forEach((validationSchema) => {
                    map[validationSchema.id] = {
                        ownerComponentId,
                        schema: validationSchema,
                    }
                })
                return map
            }, {}),
        ),
    )
    return {
        $schemas,
    }
}
