import fs from 'node:fs/promises'

await fs.copyFile(
  'node_modules/simplecc-wasm/pkg/web/simplecc_wasm_bg.wasm',
  'public/simplecc_wasm_bg.wasm',
)
