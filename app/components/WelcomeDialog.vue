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
  <ModalPopup v-model="open" direction="top" dialog-class="max-h-80dvh">
    <div class="markdown-content mxa max-w-150 p6">
      <Welcome />
      <div flex p5>
        <SimpleButton
          icon="i-uil-play"
          title="開始使用"
          ma
          @click="open = false"
        />
      </div>
    </div>
  </ModalPopup>
</template>
