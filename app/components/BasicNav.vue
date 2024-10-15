<script setup lang="ts">
</script>

<template>
  <div flex="~ gap-3 items-center" absolute left-5 top-5>
    <NuxtLink to="/" class="@hover:(bg-hover op100)" ml--0.5 rounded-full op50 transition>
      <div i-mdi-circle-double text-2xl />
    </NuxtLink>
    <div flex="~ col" font-jp-serif>
      <ruby text-xl>
        <rb>{{ $t("appname") }}</rb>
        <rt>にじゅうまる</rt>
      </ruby>
      <span mt--1 text-xs op50>maru.re</span>
    </div>
  </div>
</template>
