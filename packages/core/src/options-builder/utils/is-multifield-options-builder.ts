import { MultifieldOptionsBuilder, OptionsBuilder } from '../types'

export const isMultifieldOptionsBuilder = (builder: OptionsBuilder): builder is MultifieldOptionsBuilder => builder.type === 'multifield'
