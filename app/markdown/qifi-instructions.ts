import { createMarkdownComponent } from './_create'

export default createMarkdownComponent(
  'qifi-instructions',
  import.meta.glob('./qifi-instructions.*.md'),
)
