<script setup lang="ts">
import { validate } from '@marure/schema'
import YAML from 'js-yaml'

const {
  collections,
} = useCollections()

function removeAll() {
  removeAllData()
  location.pathname = '/'
}

async function downloadSongs() {
  try {
    const zip = await import('jszip').then(r => r.default())

    for (const collection of collections.value) {
      const data = JSON.parse(localStorage.getItem(`maru-songs-${collection.youtube}`) || '{}')
      zip.file(`[${collection.youtube}].yml`, YAML.dump(data))
    }

    const content = await zip.generateAsync({ type: 'blob' })
    const url = URL.createObjectURL(content)
    const a = document.createElement('a')
    a.href = url
    a.download = 'maru-songs.zip'
    a.click()
  }
  catch (e) {
    console.error(e)
  }
}
</script>

<template>
  <div mxa max-w-150 p15 lt-lg="p6" text-sm line-height-1.5em>
    <BasicNav />
    <h3 mb5 text-lg font-bold>
      設定
    </h3>
    <div py2 flex="~ gap-2">
      <SimpleButton icon="i-uil-trash" color="btn-simple-red" @click="removeAll()">
        <div translate-y-0.5px>
          清除所有資料
        </div>
      </SimpleButton>

      <SimpleButton icon="i-uil-folder-download" @click="downloadSongs()">
        <div translate-y-0.5px>
          下載所有歌詞檔案
        </div>
      </SimpleButton>
    </div>
  </div>
</template>
