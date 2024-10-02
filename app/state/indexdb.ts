import { createStorage } from 'unstorage'
import indexedDbDriver from 'unstorage/drivers/indexedb'

export const _songsStorage = createStorage({
  driver: indexedDbDriver({ base: 'maru:songs' }),
})
