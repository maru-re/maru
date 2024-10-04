<script setup lang="ts">
// TODO: remove this file later

const route = useRoute()
const router = useRouter()
const id = (route.params as any).id as string

router.replace(`/play?id=${id}`)
</script>

<template>
  <div />
</template>
