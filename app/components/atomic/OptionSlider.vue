<script setup lang="ts">
const props = defineProps<{
  max: number
  min: number
  step: number
  unit?: string
  default?: number
}>()

const value = defineModel<number>('modelValue', {
  type: Number,
})
</script>

<template>
  <div relative h-22px w-full flex-auto>
    <input
      v-model.number="value" type="range" class="slider"
      v-bind="props"
      absolute bottom-0 left-0 right-0 top-0 z-10 w-full align-top
    >
    <span
      v-if="props.default != null"
      border="r base" absolute bottom-0 top-0 h-full w-1px op75
      :style="{
        left: `${(props.default - min) / (max - min) * 100}%`,
      }"
    />
  </div>
</template>

<style>
.slider {
  appearance: none;
  height: 22px;
  outline: none;
  opacity: 0.7;
  -webkit-transition: 0.2s;
  transition: opacity 0.2s;
  --uno: border border-base rounded of-hidden bg-secondary;
}

.slider:hover {
  opacity: 1;
}

.slider::-webkit-slider-thumb {
  appearance: none;
  width: 5px;
  height: 22px;
  cursor: pointer;
  z-index: 10;
  --uno: bg-primary;
}

.slider::-moz-range-thumb {
  width: 5px;
  height: 22px;
  cursor: pointer;
  z-index: 10;
  --uno: bg-primary;
}
</style>
