let promise: Promise<typeof import('simplecc-wasm')>
export async function convertCC(text: string, mode: string) {
  if (!promise) {
    promise = import('simplecc-wasm').then(async (r) => {
      await r.default('/simplecc_wasm_bg.wasm')
      return r
    })
  }
  const { simplecc } = await promise
  return simplecc(text, mode)
}
