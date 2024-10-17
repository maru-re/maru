import { createMarkdownComponent } from './_create'

export default createMarkdownComponent(
  'welcome',
  import.meta.glob('./welcome.*.md'),
)
