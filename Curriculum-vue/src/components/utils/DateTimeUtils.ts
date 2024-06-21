export function DateBuilder(time: any) {
  const str = String(time).replace('T', ' ')
  return new Date(str)
}
