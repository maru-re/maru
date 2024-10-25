<script setup lang="ts">
import Welcome from '~/markdown/welcome'

const open = ref(false)

onMounted(() => {
  const value = localStorage.getItem('maru-visited')
  // Open when not visited
  if (!value) {
    open.value = true
  }

  watch(open, () => {
    localStorage.setItem('maru-visited', 'true')
  })
})
</script>

<template>
  <ModalPopup v-model="open" direction="top">
    <div class="markdown-content mxa max-h-80vh max-w-150 p6">
      <Welcome />
      <div flex p5>
        <SimpleButton
          icon="i-uil-play"
          :title="$t('intro.start-using')"
          ma
          @click="open = false"
        />
      </div>
    </div>
  </ModalPopup>
</template>
