import { getCaptions } from 'yt-caption-extractor'

export default defineEventHandler<{ query: { id: string, lang: string } }>(async (event) => {
  const { id, lang = 'zh-Hant' } = getQuery(event)

  try {
    const captions = await getCaptions(id, { lang: [lang] })
    return captions
  }
  catch (error) {
    console.error('Error processing captions:', error)
    return []
  }
})
