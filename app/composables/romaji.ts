export function katakanaToHiragana(katakana: string): string {
  return katakana.replace(/[\u30A1-\u30F6]/g, (match) => {
    const chr = match.charCodeAt(0) - 0x60
    return String.fromCharCode(chr)
  })
}

const hiraganaToRomajiMap = Object.fromEntries(([
  ['あ', 'a'],
  ['い', 'i'],
  ['う', 'u'],
  ['え', 'e'],
  ['お', 'o'],
  ['か', 'ka'],
  ['き', 'ki'],
  ['く', 'ku'],
  ['け', 'ke'],
  ['こ', 'ko'],
  ['さ', 'sa'],
  ['し', 'shi'],
  ['す', 'su'],
  ['せ', 'se'],
  ['そ', 'so'],
  ['た', 'ta'],
  ['ち', 'chi'],
  ['つ', 'tsu'],
  ['て', 'te'],
  ['と', 'to'],
  ['な', 'na'],
  ['に', 'ni'],
  ['ぬ', 'nu'],
  ['ね', 'ne'],
  ['の', 'no'],
  ['は', 'ha'],
  ['ひ', 'hi'],
  ['ふ', 'fu'],
  ['へ', 'he'],
  ['ほ', 'ho'],
  ['ま', 'ma'],
  ['み', 'mi'],
  ['む', 'mu'],
  ['め', 'me'],
  ['も', 'mo'],
  ['や', 'ya'],
  ['ゆ', 'yu'],
  ['よ', 'yo'],
  ['ら', 'ra'],
  ['り', 'ri'],
  ['る', 'ru'],
  ['れ', 're'],
  ['ろ', 'ro'],
  ['わ', 'wa'],
  ['を', 'wo'],
  ['ん', 'n'],
  ['が', 'ga'],
  ['ぎ', 'gi'],
  ['ぐ', 'gu'],
  ['げ', 'ge'],
  ['ご', 'go'],
  ['ざ', 'za'],
  ['じ', 'ji'],
  ['ず', 'zu'],
  ['ぜ', 'ze'],
  ['ぞ', 'zo'],
  ['だ', 'da'],
  ['ぢ', 'ji'],
  ['づ', 'zu'],
  ['で', 'de'],
  ['ど', 'do'],
  ['ば', 'ba'],
  ['び', 'bi'],
  ['ぶ', 'bu'],
  ['べ', 'be'],
  ['ぼ', 'bo'],
  ['ぱ', 'pa'],
  ['ぴ', 'pi'],
  ['ぷ', 'pu'],
  ['ぺ', 'pe'],
  ['ぽ', 'po'],
  ['きゃ', 'kya'],
  ['きぃ', 'kyi'],
  ['きゅ', 'kyu'],
  ['きぇ', 'kye'],
  ['きょ', 'kyo'],
  ['くぁ', 'qwa'],
  ['くぃ', 'qwi'],
  ['くぅ', 'qwu'],
  ['くぇ', 'qwe'],
  ['くぉ', 'qwo'],
  ['くゃ', 'qya'],
  ['くゅ', 'qyu'],
  ['くょ', 'qyo'],
  ['しゃ', 'sha'],
  ['しぃ', 'syi'],
  ['しゅ', 'shu'],
  ['しぇ', 'she'],
  ['しょ', 'sho'],
  ['すぁ', 'swa'],
  ['すぃ', 'swi'],
  ['すぅ', 'swu'],
  ['すぇ', 'swe'],
  ['すぉ', 'swo'],
  ['ちゃ', 'cha'],
  ['ちぃ', 'cyi'],
  ['ちゅ', 'chu'],
  ['ちぇ', 'che'],
  ['ちょ', 'cho'],
  ['つぁ', 'tsa'],
  ['つぃ', 'tsi'],
  ['つぇ', 'tse'],
  ['つぉ', 'tso'],
  ['てゃ', 'tha'],
  ['てぃ', 'thi'],
  ['てゅ', 'thu'],
  ['てぇ', 'the'],
  ['てょ', 'tho'],
  ['とぁ', 'twa'],
  ['とぃ', 'twi'],
  ['とぅ', 'twu'],
  ['とぇ', 'twe'],
  ['とぉ', 'two'],
  ['にゃ', 'nya'],
  ['にぃ', 'nyi'],
  ['にゅ', 'nyu'],
  ['にぇ', 'nye'],
  ['にょ', 'nyo'],
  ['ひゃ', 'hya'],
  ['ひぃ', 'hyi'],
  ['ひゅ', 'hyu'],
  ['ひぇ', 'hye'],
  ['ひょ', 'hyo'],
  ['ふぁ', 'fa'],
  ['ふぃ', 'fi'],
  ['ふぇ', 'fe'],
  ['ふぉ', 'fo'],
  ['ふゃ', 'fya'],
  ['ふゅ', 'fyu'],
  ['ふょ', 'fyo'],
  ['みゃ', 'mya'],
  ['みぃ', 'myi'],
  ['みゅ', 'myu'],
  ['みぇ', 'mye'],
  ['みょ', 'myo'],
  ['りゃ', 'rya'],
  ['りぃ', 'ryi'],
  ['りゅ', 'ryu'],
  ['りぇ', 'rye'],
  ['りょ', 'ryo'],
  ['ぎゃ', 'gya'],
  ['ぎぃ', 'gyi'],
  ['ぎゅ', 'gyu'],
  ['ぎぇ', 'gye'],
  ['ぎょ', 'gyo'],
  ['ぐぁ', 'gwa'],
  ['ぐぃ', 'gwi'],
  ['ぐぅ', 'gwu'],
  ['ぐぇ', 'gwe'],
  ['ぐぉ', 'gwo'],
  ['じゃ', 'ja'],
  ['じぃ', 'jyi'],
  ['じゅ', 'ju'],
  ['じぇ', 'je'],
  ['じょ', 'jo'],
  ['ぢゃ', 'dya'],
  ['ぢぃ', 'dyi'],
  ['ぢゅ', 'dyu'],
  ['ぢぇ', 'dye'],
  ['ぢょ', 'dyo'],
  ['でゃ', 'dha'],
  ['でぃ', 'dhi'],
  ['でゅ', 'dhu'],
  ['でぇ', 'dhe'],
  ['でょ', 'dho'],
  ['どぁ', 'dwa'],
  ['どぃ', 'dwi'],
  ['どぅ', 'dwu'],
  ['どぇ', 'dwe'],
  ['どぉ', 'dwo'],
  ['びゃ', 'bya'],
  ['びぃ', 'byi'],
  ['びゅ', 'byu'],
  ['びぇ', 'bye'],
  ['びょ', 'byo'],
  ['ぴゃ', 'pya'],
  ['ぴぃ', 'pyi'],
  ['ぴゅ', 'pyu'],
  ['ぴぇ', 'pye'],
  ['ぴょ', 'pyo'],
  ['んあ', 'n\'a'],
  ['んい', 'n\'i'],
  ['んう', 'n\'u'],
  ['んえ', 'n\'e'],
  ['んお', 'n\'o'],
  ['んや', 'n\'ya'],
  ['んゆ', 'n\'yu'],
  ['んよ', 'n\'yo'],
  ['んわ', 'n\'wa'],
  ['んを', 'n\'wo'],
  ['んん', 'n\'n'],
  ['ぁ', 'a'],
  ['ぃ', 'i'],
  ['ぅ', 'u'],
  ['ぇ', 'e'],
  ['ぉ', 'o'],
  ['ゃ', 'ya'],
  ['ゅ', 'yu'],
  ['ょ', 'yo'],
] as [string, string][])
  .sort((a, b) => b[0].length - a[0].length))

interface RomajiToken {
  source: string;
  value: string;
  mergeForwards?: boolean;
}

interface HiraganaToRomajiOptions {
  mode?: 'split' | 'merge'
}

export function hiraganaToRomaji(hiragana: string, options: HiraganaToRomajiOptions = {}) {
  const {
    mode = 'merge'
  } = options

  const chars = katakanaToHiragana(hiragana)
  const tokens: RomajiToken[] = chars.split('').map((char) => ({
    source: char,
    value: hiraganaToRomajiMap[char] ?? ''
  }))

  transformOnbiki(tokens)
  transformSokuon(tokens)

  return tokens
    .filter(({ value }) => value)
    .map((token) => mode === 'merge' && token.mergeForwards ? token.value : ` ${token.value}`)
    .join('')
    .trimStart()
}

function transformOnbiki(tokens: RomajiToken[]) {
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i]
    const prev = tokens[i - 1]
    if (
      token?.source !== 'ー'
      || !prev
      || !/[aeiou]$/.test(prev?.value)
    )
      continue

    token.value = prev.value.at(-1)!
    token.mergeForwards = true
  }
}

function transformSokuon(tokens: RomajiToken[]) {
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i]
    const next = tokens[i + 1]
    if (
      token?.source !== 'っ'
      || !next
      || !/^[^aeiou]/.test(next?.value)
    )
      continue

    token.value = next.value.at(0)!
    next.mergeForwards = true
  }
}