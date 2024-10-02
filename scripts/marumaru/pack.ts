import type { MaruSongData } from '~~/packages/schema/src'
import fs from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import fg from 'fast-glob'
import YAML from 'js-yaml'
import JSZip from 'jszip'
import { normalizeFilename } from './parse'

const cwd = fileURLToPath(new URL('.', import.meta.url))
const paths = await fg('data/**/*.yaml', { cwd, absolute: true })

const files = await Promise.all(paths.map(async (path) => {
  const content = await fs.readFile(path, 'utf-8')
  return {
    path,
    content,
    data: YAML.load(content) as MaruSongData,
  }
}))

const artists = new Set<string>(
  files.flatMap(({ data }) => data.artists || []),
)
const tags = new Set<string>(
  files.flatMap(({ data }) => data.tags || []),
)

await fs.rm(join(cwd, `packs`), { recursive: true })

for (const artist of artists) {
  const zip = new JSZip()
  const songs = files.filter(({ data }) => data.artists?.includes(artist))
  for (const { content, data } of songs) {
    zip.file(`[${data.youtube}]-${normalizeFilename(data.title)}.yaml`, content)
  }
  await fs.mkdir(join(cwd, `packs/by-artist`), { recursive: true })
  await fs.writeFile(join(cwd, `packs/by-artist/${normalizeFilename(artist)}.zip`), await zip.generateAsync({ type: 'nodebuffer' }))
}

for (const tag of tags) {
  const zip = new JSZip()
  const songs = files.filter(({ data }) => data.tags?.includes(tag))
  for (const { content, data } of songs) {
    zip.file(`[${data.youtube}]-${normalizeFilename(data.title)}.yaml`, content)
  }
  await fs.mkdir(join(cwd, `packs/by-tag`), { recursive: true })
  await fs.writeFile(join(cwd, `packs/by-tag/${normalizeFilename(tag)}.zip`), await zip.generateAsync({ type: 'nodebuffer' }))
}
