import type { ShortcutsGroup } from '~/state/shortcuts'
import { _shortcuts } from '~/state/shortcuts'

export function useShortcutsRegistry(group: MaybeRefOrGetter<ShortcutsGroup>) {
  const ref = toRef(group)
  _shortcuts.set(ref.value.key, ref)

  onUnmounted(() => {
    if (_shortcuts.get(ref.value.key) === ref)
      _shortcuts.delete(ref.value.key)
  })
}

export function getShortcutsGroups() {
  return computed(() => Array.from(_shortcuts.values()).map(i => i.value))
}
