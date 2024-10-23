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
  <ModalPopup
    v-model="visible"
    dialog-class="h-60dvh! p0! flex justify-center"
    @click-outside="visible = false"
  >
    <div flex="~ col gap-4" h-full max-w-700px w-full p6>
      <h2 text-xl>
        {{ $t("editor.insertMultiline") }}
        <button float-right @click="visible = false">
          <span i-uil-times />
        </button>
      </h2>
      <TextInput v-model="lyrics" flex="1" type="textarea" input-class="h-full" :placeholder="$t('editor.lyricsPlaceholder')" />
      <SimpleButton class="px4! py3!" @click="importLyrics">
        {{ $t("editor.insert") }}
      </SimpleButton>
    </div>
  </ModalPopup>
</template>
