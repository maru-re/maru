interface EditorContext {
  goNextAfterSetCurrentTimestemp: boolean
}

export const InjectionKeyEditor: InjectionKey<Ref<EditorContext>> = Symbol('editor')

const defaultEditorContext: EditorContext = {
  goNextAfterSetCurrentTimestemp: true,
}

export function provideEditorContext(context = defaultEditorContext) {
  provide(InjectionKeyEditor, ref(context))
}

export function useEditorContext() {
  return inject(InjectionKeyEditor, ref(defaultEditorContext))
}
