import { SelectionOption } from '@form-crafter/core'

export const getTimeByHoursOptions = (): SelectionOption[] => {
    const result: SelectionOption[] = []

    for (let i = 0; i < 24; i++) {
        const value = i.toString().padStart(2, '0')
        result.push({ value, label: value })
    }

    return result
}
