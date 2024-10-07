export function useRouteHash(mergeQuery = true) {
  const route = useRoute()

  const state = ref<Record<string, string | undefined>>({})
  watchPausable(
    () => [route.hash, route.query],
    () => {
      const search = new URLSearchParams(route.hash.slice(1))
      const hash = Object.fromEntries(search.entries()) as any
      state.value = mergeQuery
        ? {
            ...hash,
            ...route.query,
          }
        : hash
    },
    { deep: true, immediate: true },
  )

  return state
}
