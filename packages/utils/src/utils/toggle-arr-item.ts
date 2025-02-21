export const toggleArrItem = <T>(array: T[], item: T): T[] => {
    const index = array.indexOf(item)
    if (index !== -1) {
        return array.filter((_, i) => i !== index)
    } else {
        return [...array, item]
    }
}
