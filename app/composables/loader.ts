import { parseSongData } from '@marure/parser'
import { type MaruSongDataParsed, validate } from '@marure/schema'
import { decompressFromEncodedURIComponent } from 'lz-string'

export function useSongData() {
  const route = useRoute()
  const source = ref<'share' | 'local' | 'demo'>('demo')
  const status = ref<'loading' | 'error' | 'done' | 'missing'>('loading')
  const data = shallowRef<MaruSongDataParsed>()
  const error = shallowRef<unknown>()

  watch(
    () => route.query as {
      share?: string
      id?: string
      demo?: string
    },
    async (query) => {
      status.value = 'loading'
      error.value = undefined

      try {
        if (query.demo) {
          source.value = 'demo'
          data.value = await import('../samples/sample-1').then(r => r.default)
        }
        else if (query.share) {
          source.value = 'share'
          data.value = parseSongData(validate(JSON.parse(
            decompressFromEncodedURIComponent(query.share),
          )))
        }
        else if (query.id) {
          source.value = 'local'
          const raw = await loadSongFromStorage(query.id)
          data.value = raw
            ? parseSongData(validate(raw))
            : undefined
          if (!data.value) {
            status.value = 'missing'
          }
        }
        else {
          throw new Error('Invalid url')
        }

        status.value = 'done'
      }
      catch (e) {
        error.value = e
        status.value = 'error'
      }
    },
    { deep: true, immediate: true },
  )

  return {
    status,
    data,
    source,
    error,
  }
}
