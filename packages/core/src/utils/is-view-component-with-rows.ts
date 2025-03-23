import { isNotEmpty } from '@form-crafter/utils'

import { ViewComponent, ViewComponentWithRows } from '../views'

export const isViewComponentWithRows = (component: ViewComponent): component is ViewComponentWithRows => {
    return isNotEmpty(component.rows)
}
