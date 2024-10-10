<script setup lang="ts">
const emit = defineEmits<{
  (event: 'import', lyrics: string): void
}>()

const visible = defineModel<boolean>({ default: false })

const lyrics = ref('')

function importLyrics() {
  emit('import', lyrics.value)
  visible.value = false
}
</script>

<template>
  <ModalDialog
    v-model="visible"
    dialog-class="w-50vw! max-w-700px h-80vh p0!"
    @click-outside="visible = false"
  >
    <div flex="~ col gap-4" h-full p6>
      <h2 text-xl>
        {{ $t("editor.insertMultiline") }}
        <div float-right>
          <button @click="visible = false">
            <div i-uil-times />
          </button>
        </div>
      </h2>
      <TextInput v-model="lyrics" flex="1" type="textarea" input-class="h-full" :placeholder="$t('editor.lyricsPlaceholder')" />
      <SimpleButton class="px4! py3!" @click="importLyrics">
        {{ $t("editor.insert") }}
      </SimpleButton>
    </div>
  </ModalDialog>
</template>
