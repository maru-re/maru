import { createMarkdownComponent } from './_create'

export default createMarkdownComponent(
  'format',
  import.meta.glob('./format.*.md'),
)
