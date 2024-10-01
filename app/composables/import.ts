import { type MaruSongData, validate } from '@marure/schema'
import { parseSongData } from '~~/packages/parser/src'
import YAML from 'yaml'

export const SUPPORTED_IMPORT_EXT = ['json', 'yml', 'yaml']

async function * traverseFileList(files?: FileList | FileSystemEntry[]): AsyncGenerator<File> {
  for (const item of files || []) {
    if (item == null)
      continue
    if (item instanceof File) {
      yield item
    }
    else {
      if (item.isDirectory) {
        const dir = item as FileSystemDirectoryEntry
        const reader = dir.createReader()
        const entries = await new Promise<FileSystemEntry[]>((resolve, reject) => {
          reader.readEntries(resolve, reject)
        })
        yield * traverseFileList(entries)
      }
      else {
        if (item.isFile) {
          const file = item as FileSystemFileEntry
          yield await new Promise<File>((resolve, reject) => {
            file.file(resolve, reject)
          })
        }
      }
    }
  }
}

export interface FileParseResult {
  file: File
  data?: MaruSongData
  error?: unknown
}

export async function parseFiles(files?: FileList | FileSystemEntry[]): Promise<FileParseResult[]> {
  const result: FileParseResult[] = []

  for await (const file of traverseFileList(files)) {
    try {
      const ext = file.name.split('.').pop()?.toLowerCase()
      let json: any
      switch (ext) {
        case 'json': {
          json = JSON.parse(await file.text())
          break
        }
        case 'yml':
        case 'yaml': {
          json = YAML.parse(await file.text())
          break
        }
        // TODO: suport zip
        default:
          throw new Error(`Unsupported file extension: ${ext}`)
      }
      const data = validate(json)
      parseSongData(data)
      result.push({ file, data })
    }
    catch (err) {
      console.error('Failed to import file:', file, err)
      result.push({ file, error: err })
    }
  }

  return result
}
export async function importFromFiles(files?: FileList | FileSystemEntry[] | null) {
  if (!files) {
    return
  }

  const result = await parseFiles(files)

  const errors = result.filter(r => r.error)
  const success = result.filter(r => !r.error && r.data)

  const messages: string[] = []
  if (success.length) {
    messages.push(`成功解析 ${success.length} 個檔案:`)
    messages.push(...success.map(r => r.file.name))
    messages.push('')
  }

  if (errors.length) {
    messages.push(`解析失敗 ${errors.length} 個檔案:`)
    messages.push(...errors.map(r => `${r.file.name} (${r.error})`))
    messages.push('')
  }

  if (success.length) {
    messages.push('是否導入成功的檔案？')

    // TODO: proper dialog
    // eslint-disable-next-line no-alert
    if (confirm(messages.join('\n'))) {
      saveSongsToLocal(success.map(r => r.data!))
      if (location.pathname === '/' && success.length === 1)
        location.pathname = `/songs/${success[0]!.data!.youtube}`
    }
  }
  else if (errors.length) {
    // TODO: proper dialog
    // eslint-disable-next-line no-alert
    alert(messages.join('\n'))
  }
}
