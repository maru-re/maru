import { createMarkdownComponent } from './_create'

export default createMarkdownComponent(
  'about',
  import.meta.glob('./about.*.md'),
)
