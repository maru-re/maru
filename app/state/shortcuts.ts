export interface ShortcutDefinition {
  title: string
  combos: string[][]
}

export interface ShortcutsGroup {
  key: string
  title: string
  shortcuts: ShortcutDefinition[]
}

export const _shortcuts = shallowReactive(new Map<string, Ref<ShortcutsGroup>>())
