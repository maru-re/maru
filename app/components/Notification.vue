<script setup lang='ts'>
withDefaults(
  defineProps<{ value?: boolean }>(),
  { value: false },
)
</script>

<template>
  <div
    class="fixed left-0 right-0 top-0 z-50 text-center"
    :class="value ? '' : 'pointer-events-none overflow-hidden'"
  >
    <div
      class="m-3 inline-block flex flex-inline items-center border border-base rounded px-3 py-1 text-primary transition-all duration-300 bg-base"
      :style="value ? {} : { transform: 'translateY(-150%)' }"
      :class="value ? 'shadow' : 'shadow-none'"
    >
      <slot />
    </div>
  </div>
</template>
