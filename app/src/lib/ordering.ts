export function reorder<T>(list: T[], startIndex: number, endIndex: number): T[] {
  const arr = list.slice()
  const [removed] = arr.splice(startIndex, 1)
  arr.splice(endIndex, 0, removed)
  return arr
}
