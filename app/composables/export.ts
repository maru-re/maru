import type { MaruSongData } from '@marure/schema'
import { normalizeFilename } from '@marure/utils'
import YAML from 'js-yaml'
import { _collections } from '~/state/local-storage'

export function serializeSongToMaru(data: MaruSongData) {
  const filename = `[${normalizeFilename(data.title)}]-[${normalizeFilename(data.artists?.join('-') || '')}]-[${data.youtube}].maru`
  const yaml = YAML.dump({
    ...data,
    lyrics: undefined,
  })
  return {
    filename,
    yaml,
  }
}

export function exportSongMaru(data: MaruSongData) {
  const {
    filename,
    yaml,
  } = serializeSongToMaru(data)

  const url = URL.createObjectURL(new Blob([yaml], { type: 'text/yaml' }))
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
}

export async function exportSongsZip(ids?: string[]) {
  ids = ids || _collections.value.map(g => g.youtube)

  const counter = new Map<string, number>()
  function record(name: string) {
    counter.set(name, (counter.get(name) || 0) + 1)
  }

  try {
    const zip = await import('jszip').then(r => r.default())

    await Promise.all(ids.map(async (id) => {
      const data = await loadSongFromStorage(id)
      if (!data)
        return
      data.artists?.map(record)
      record(data.title)
      const {
        filename,
        yaml,
      } = serializeSongToMaru(data)
      zip.file(filename, yaml)
    }))

    const sortedCounter = [...counter.entries()].sort((a, b) => b[1] - a[1])
    const slice = sortedCounter.slice(0, 2).map(i => i[0]).join(' ')
    const content = await zip.generateAsync({ type: 'blob' })

    const url = URL.createObjectURL(content)
    const a = document.createElement('a')
    a.href = url
    a.download = `[maru.re 匯出] ${normalizeFilename(slice)} 等 ${ids.length} 首歌曲.zip`
    a.click()
  }
  catch (e) {
    console.error(e)
  }
}
