import { ComponentsService } from './components'

type Params = {
    componentsService: ComponentsService
}

export const init = ({ componentsService }: Params) => {
    componentsService.startInit()
}
