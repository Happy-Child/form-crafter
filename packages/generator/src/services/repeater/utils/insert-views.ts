// import { EntityId, ViewDefinition, ViewsDefinitions } from '@form-crafter/core'

// type Params = {
//     views: ViewsDefinitions
//     additionalViews: ViewsDefinitions
//     repeaterId: EntityId
//     additionalRowId: EntityId
// }

// export const insertViews = ({ views, additionalViews, repeaterId, additionalRowId }: Params): ViewsDefinitions => {
//     return Object.fromEntries(
//         Object.entries(views).map(([viewId, definition]): [EntityId, ViewDefinition] => {
//             if (!(viewId in additionalViews)) {
//                 return [viewId, definition]
//             }

//             const additionalDefinition = additionalViews[viewId]
//             definition = {
//                 rows: { ...definition.rows, ...additionalDefinition.rows },
//                 components: { ...definition.components, ...additionalDefinition.components },
//             }

//             definition.components[repeaterId] = {
//                 ...definition.components[repeaterId],
//                 rows: [...(definition.components[repeaterId].rows || []), { id: additionalRowId }],
//             }

//             return [viewId, definition]
//         }),
//     )
// }
