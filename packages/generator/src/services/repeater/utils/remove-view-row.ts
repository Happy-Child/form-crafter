// import { EntityId, ViewDefinition, ViewsDefinitions } from '@form-crafter/core'
// import { isEmpty, isNotEmpty } from '@form-crafter/utils'

// type CollectIds = {
//     rows: EntityId[]
//     components: EntityId[]
// }

// const removeViewRowAndComponentsIds = (rowIdToRemove: EntityId, viewDefinition: ViewDefinition): CollectIds => {
//     const rowIdsQueue: EntityId[] = [rowIdToRemove]
//     const collectIds: CollectIds = { rows: [], components: [] }

//     while (rowIdsQueue.length) {
//         const curRowId = rowIdsQueue.shift()
//         if (isEmpty(curRowId)) {
//             continue
//         }

//         collectIds.rows.push(curRowId)

//         viewDefinition.rows[curRowId].children.forEach(({ id }) => {
//             collectIds.components.push(id)

//             const component = viewDefinition.components[id]
//             if (isNotEmpty(component.rows)) {
//                 rowIdsQueue.push(...component.rows.map(({ id }) => id))
//             }

//             delete viewDefinition.components[id]
//         })

//         delete viewDefinition.rows[curRowId]
//     }

//     return collectIds
// }

// const getRemovedViewRow = (viewDefinition: ViewDefinition, rowId: EntityId) => {
//     const finalViewDefinition: ViewDefinition = { rows: { ...viewDefinition.rows }, components: { ...viewDefinition.components } }

//     const removedIds = removeViewRowAndComponentsIds(rowId, finalViewDefinition)

//     return {
//         viewTree: finalViewDefinition,
//         removedIds,
//     }
// }

// type RemoveViewRow = {
//     views: ViewsDefinitions
//     componentsIdsToRemove: EntityId[]
//     rowsIdsToRemove: EntityId[]
// }

// export const removeViewRow = (views: ViewsDefinitions, dynamicContainerId: EntityId, rowIdToRemove: EntityId): RemoveViewRow => {
//     const finalViews: ViewsDefinitions = {}
//     let rowsIdsToRemove: RemoveViewRow['rowsIdsToRemove'] = []
//     let componentsIdsToRemove: RemoveViewRow['componentsIdsToRemove'] = []

//     for (const [viewId, viewsDefinition] of Object.entries(views)) {
//         const { viewTree: finalViewDefinition, removedIds } = getRemovedViewRow(viewsDefinition, rowIdToRemove)

//         const dynamicContainerRows = finalViewDefinition.components[dynamicContainerId].rows?.filter(({ id }) => id !== rowIdToRemove) || []
//         finalViewDefinition.components[dynamicContainerId] = {
//             ...finalViewDefinition.components[dynamicContainerId],
//             rows: dynamicContainerRows,
//         }

//         finalViews[viewId] = finalViewDefinition

//         rowsIdsToRemove.push(...removedIds.rows)
//         componentsIdsToRemove.push(...removedIds.components)
//     }

//     rowsIdsToRemove = Array.from(new Set(rowsIdsToRemove))
//     componentsIdsToRemove = Array.from(new Set(componentsIdsToRemove))

//     return { views: finalViews, rowsIdsToRemove, componentsIdsToRemove }
// }
