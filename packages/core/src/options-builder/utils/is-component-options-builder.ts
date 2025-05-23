import { componentsBuildersTypes } from '../consts'
import { OptionsBuilder } from '../types'

export const isComponentOptionsBuilder = (builder: OptionsBuilder): builder is OptionsBuilder => componentsBuildersTypes.includes(builder.type)
