export interface InferredSongInfo {
  title?: string
  artists?: string[]
}

export function inferSongInfoFromVideoTitle(title: string) {
  const info: InferredSongInfo = {}

  // eslint-disable-next-line regexp/no-super-linear-backtracking
  const match1 = title.match(/^(?:【.*】|\[.*\])?([^「『]*)「([^「」]+)」/) || title.match(/^(?:【.*】|\[.*\])?([^「『]*)『([^『』]+)』/)
  if (match1) {
    info.title = match1[2]?.trim()
    info.artists = splitArtistNames(match1[1]!)
    return info
  }

  const match2 = title.match(/^([^\-]*)-+([^/]+)/)
  if (match2) {
    info.title = match2[2]?.trim()
    info.artists = splitArtistNames(match2[1]!)
    return info
  }

  return undefined
}

export function splitArtistNames(str: string): string[] {
  return str
    .trim()
    .split(/[,;、×]|\bfeat\.?|\bft\s*\.?|\bwith\r/gi)
    .map(s => s.trim())
    .filter(Boolean)
}
