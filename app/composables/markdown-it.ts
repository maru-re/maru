import MarkdownIt from 'markdown-it'
import Sanitize from 'sanitize-html'

let md: MarkdownIt | null = null

export function renderMarkdown(
  text: string,
) {
  if (!md) {
    md = new MarkdownIt({
      // To be safe from XSS, we disable HTML tags
      xhtmlOut: false,
      html: false,
      linkify: true,
      breaks: true,
      typographer: true,
    })
  }

  return Sanitize(md.render(text))
}
