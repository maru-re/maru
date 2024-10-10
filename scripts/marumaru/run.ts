import fs from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import fg from 'fast-glob'
import YAML from 'js-yaml'
import { validate } from '../../packages/schema/src'
import { normalizeFilename } from '../../packages/utils/src'
import { parse } from './parse'
import { urls } from './sources'

const cwd = fileURLToPath(new URL('.', import.meta.url))
const files = await fg('out/html/*.html', { cwd, absolute: true })

await fs.rm(join(cwd, 'out/data'), { recursive: true, force: true })

for (const file of files) {
  const content = await fs.readFile(file, 'utf-8')
  const id = file.match(/(\d+)\.html$/)![1]
  const url = urls.find(u => u.id === id)!.url
  if (content.match('系統已記錄您的IP')) {
    await fs.rm(file)
    continue
  }
  const parsed = validate(parse(content, url))
  if (!parsed.title) {
    console.log(`Failed to parse ${url}`, parsed)
    continue
  }
  await fs.mkdir(join(cwd, 'out/data'), { recursive: true })
  const filename = `[${normalizeFilename(parsed.title)}]-[${normalizeFilename(parsed.artists?.join('-') || '')}]-[${parsed.youtube}].maru`
  await fs.writeFile(
    join(cwd, 'out/data', filename),
    YAML.dump(parsed),
  )
}
