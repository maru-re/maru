import type { MaruSongDataParsed } from '@marure/schema'
import type { RouteLocationNormalizedLoaded } from 'vue-router'
import { parseSongData } from '@marure/parser'
import { validate } from '@marure/schema'
import { decompressFromEncodedURIComponent } from 'lz-string'

export type SongDataSource = 'share' | 'local' | 'demo' | 'create'

export interface UseSongDataResult {
  id: Ref<string>
  status: Ref<'loading' | 'error' | 'done' | 'missing'>
  data: Ref<MaruSongDataParsed | undefined>
  source: Ref<SongDataSource>
  error: Ref<unknown>
}

export function useSongData(
  query: () => {
    share?: string
    id?: string
    demo?: string
  },
  create = false,
): UseSongDataResult & { then: (cb: (ctx: UseSongDataResult) => void) => Promise<void> } {
  const source = ref<SongDataSource>('demo')
  const status = ref<'loading' | 'error' | 'done' | 'missing'>('loading')
  const data = shallowRef<MaruSongDataParsed>()
  const error = shallowRef<unknown>()
  const id = ref()
  let promise: Promise<void> | undefined

  watch(
    query,
    (query) => {
      promise = (async () => {
        status.value = 'loading'
        error.value = undefined

        try {
          if (query.demo) {
            source.value = 'demo'
            data.value = await import('../samples/sample-1').then(r => r.default())
          }
          else if (query.share) {
            source.value = 'share'
            data.value = parseSongData(validate(JSON.parse(
              decompressFromEncodedURIComponent(query.share),
            )))
          }
          else if (query.id) {
            id.value = query.id
            source.value = 'local'
            const raw = await loadSongFromStorage(query.id)
            data.value = raw
              ? parseSongData(validate(raw))
              : undefined
            if (!data.value) {
              if (create) {
                source.value = 'create'
                data.value = createEmptySongData(query.id)
              }
              else {
                status.value = 'missing'
              }
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
      })()
    },
    { deep: true, immediate: true },
  )

  const ctx: UseSongDataResult = {
    id,
    status,
    data,
    source,
    error,
  }

  return {
    ...ctx,
    then(cb) {
      return Promise.resolve(promise)
        .then(() => cb(ctx))
    },
  }
}
