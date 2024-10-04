<template>
  <div
    class="markdown-content"
    mxa max-w-150 p15 lt-lg="p6 mt-20" line-height-1.7em
  >
    <BasicNav />
    <slot />
  </div>
</template>

<style>
.markdown-content a {
  --uno: 'op75 hover:op100 hover:underline';
}

.markdown-content h1 {
  --uno: font-bold text-2xl mb5;
}

.markdown-content p {
  --uno: mb5;
}

.markdown-content pre {
  --uno: px3 py2 bg-gray-100 rounded max-w-200 of-auto text-sm;
}

.markdown-content .shiki {
  background: #f7f7f7 !important;
}

.dark .markdown-content .shiki {
  background: var(--shiki-dark-bg) !important;
}

.dark .markdown-content .shiki span {
  color: var(--shiki-dark) !important;
}
</style>
