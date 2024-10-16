export function useWeakId() {
  const map = new WeakMap<any, string>()

  return {
    weakid(obj: any) {
      if (!map.has(obj)) {
        map.set(obj, Math.random().toString(36).slice(2))
      }
      return map.get(obj)
    },
  }
}
