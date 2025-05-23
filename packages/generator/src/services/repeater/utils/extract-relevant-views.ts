import { RepeaterComponentSchema, ViewsDefinitions } from '@form-crafter/core'

export const extractRelevantViews = (views: ViewsDefinitions, viewsTemplate: RepeaterComponentSchema['template']['views']): ViewsDefinitions => {
    const targetViewsIds = Object.keys(viewsTemplate)
    return Object.fromEntries(Object.entries(views).filter(([viewId]) => targetViewsIds.includes(viewId)))
}
