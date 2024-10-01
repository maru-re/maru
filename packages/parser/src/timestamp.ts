export function timestampToSeconds(ts: string): number {
  const stamps = ts.split(':').map(Number)
  let seconds = 0
  stamps.reverse().forEach((stamp, i) => {
    seconds += stamp * 60 ** i
  })
  return seconds
}

export function secondsToTimestamp(seconds: number, colons = 2, digits = 2): string {
  const stamps = []
  while (seconds > 0) {
    stamps.push(seconds % 60)
    seconds = Math.floor(seconds / 60)
  }
  while (stamps.length < colons) {
    stamps.push(0)
  }
  return stamps.map((n, idx) => {
    if (idx === 0) {
      const str = n.toFixed(digits)
      const [int, dec] = str.split('.') as [string, string | undefined]
      return [int.padStart(2, '0'), dec].filter(x => x != null).join('.')
    }
    return n.toString().padStart(2, '0')
  }).reverse().join(':')
}
