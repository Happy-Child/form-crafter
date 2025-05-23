import { GroupOptionsBuilder, OptionsBuilder } from '../types'

export const isGroupOptionsBuilder = (builder: OptionsBuilder): builder is GroupOptionsBuilder => builder.type === 'group'
