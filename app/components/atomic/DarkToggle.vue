<script setup lang="ts">
defineProps<{
  type?: 'icon' | 'button'
}>()

const color = useColorMode()

useHead({
  meta: [{
    id: 'theme-color',
    name: 'theme-color',
    content: () => color.value === 'dark' ? '#000000' : '#ffffff',
  }],
})

const isAppearanceTransition = typeof document !== 'undefined'
  && !!document.startViewTransition
  && !window.matchMedia('(prefers-reduced-motion: reduce)').matches

function toggle(event: MouseEvent) {
  if (!isAppearanceTransition || !event) {
    color.preference = color.value === 'dark' ? 'light' : 'dark'
    return
  }

  const x = event.clientX
  const y = event.clientY
  const endRadius = Math.hypot(
    Math.max(x, innerWidth - x),
    Math.max(y, innerHeight - y),
  )
  const transition = document.startViewTransition(async () => {
    color.preference = color.value === 'dark' ? 'light' : 'dark'
    await nextTick()
  })

  transition.ready.then(() => {
    const clipPath = [
      `circle(0px at ${x}px ${y}px)`,
      `circle(${endRadius}px at ${x}px ${y}px)`,
    ]
    document.documentElement.animate(
      {
        clipPath: color.value === 'dark'
          ? [...clipPath].reverse()
          : clipPath,
      },
      {
        duration: 400,
        easing: 'ease-in',
        pseudoElement: color.value === 'dark'
          ? '::view-transition-old(root)'
          : '::view-transition-new(root)',
      },
    )
  })
}
</script>

<template>
  <ActionButton
    icon="i-uil-sun dark:i-uil-moon"
    :type
    :title="$t('displayMode.toggleMode', { mode: color.value === 'dark' ? $t('displayMode.light') : $t('displayMode.dark') })"
    @click="toggle"
  />
</template>
