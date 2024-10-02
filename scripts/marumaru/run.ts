import fs from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import fg from 'fast-glob'
import YAML from 'js-yaml'
import { validate } from '../../packages/schema/src'
import { normalizeFilename, parse } from './parse'
import { urls } from './sources'

const cwd = fileURLToPath(new URL('.', import.meta.url))
const files = await fg('downloads/*.html', { cwd, absolute: true })

await fs.rm(join(cwd, 'data'), { recursive: true, force: true })

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
  await fs.mkdir(join(cwd, 'data'), { recursive: true })
  await fs.writeFile(
    join(cwd, 'data', `[${parsed.youtube}]-${normalizeFilename(parsed.title)}.yaml`),
    YAML.dump(parsed),
  )
}
