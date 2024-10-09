<script setup lang="ts">
import { Tooltip } from 'floating-vue'

const color = useColorMode()

useHead({
  meta: [{
    id: 'theme-color',
    name: 'theme-color',
    content: () => color.value === 'dark' ? '#000000' : '#ffffff',
  }],
})

const isAppearanceTransition = typeof document !== 'undefined'
// eslint-disable-next-line ts/ban-ts-comment
// @ts-ignore document.startViewTransition can be undefined
  && document.startViewTransition
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
  // eslint-disable-next-line ts/ban-ts-comment
  // @ts-ignore document.startViewTransition can be undefined
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
  <Tooltip placement="left">
    <IconButton icon="i-uil-sun dark:i-uil-moon" @click="toggle" />
    <template #popper>
      <div>
        切換為{{ $t("toggleDisplayMode", { mode: color.value === 'dark' ? '明亮' : '暗黑' }) }}模式
      </div>
    </template>
  </Tooltip>
</template>
