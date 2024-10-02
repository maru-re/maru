import { existsSync } from 'node:fs'
import fs from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { urls } from './sources'

const cwd = fileURLToPath(new URL('.', import.meta.url))

await fs.mkdir(join(cwd, `out/html`), { recursive: true })

for (const { url, id } of urls) {
  const filename = join(cwd, `out/html/${id}.html`)
  if (existsSync(filename)) {
    console.log(`Skipping ${id}`)
    continue
  }
  console.log(`Fetching ${id}`)
  const html = await fetch(url, {
    redirect: 'manual',
  })
    .then(async (res) => {
      if (res.status >= 200 && res.status < 300) {
        const text = await res.text()
        if (text.match('系統已記錄您的IP')) {
          throw new Error('Not crawled by web.archive.org')
        }
        return text
      }
      throw new Error(`${res.status} ${res.statusText}`)
    })
    .catch((err) => {
      console.error(`Failed to fetch ${url}: ${err}`)
      return null
    })
  if (!html) {
    continue
  }
  await fs.writeFile(filename, html, 'utf8')
}
