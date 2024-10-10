import type { LyricLine, MaruSongDataParsed } from '@marure/schema'
import type { YouTube, YouTubePlayer } from '~/types/player'

export type PlayerControls = ReturnType<typeof usePlayer>

export function usePlayer(data: MaruSongDataParsed, autoplay = true) {
  const player = shallowRef<YouTubePlayer | undefined>(undefined)
  const current = ref(0)
  const duration = ref(0)
  const status = ref<'playing' | 'paused' | 'ended' | 'loading' | 'unstarted'>('unstarted')
  const settings = useSettings()
  const error = ref<any>(null)
  const localOffset = ref(0)
  const offset = computed(() => (data.offset || 0) + localOffset.value)

  let YT: YouTube | undefined

  onMounted(() => {
    YT = window.YT as YouTube | undefined
    if (!YT) {
      let script = document.getElementById('youtube-iframe-api') as HTMLScriptElement
      if (!script) {
        script = document.createElement('script')
        script.src = 'https://www.youtube.com/iframe_api'
        script.id = 'youtube-iframe-api'
        document.head.append(script)
      }
      // @ts-expect-error onYouTubeIframeAPIReady
      window.onYouTubeIframeAPIReady = () => {
        YT = window.YT as YouTube
        if (!YT) {
          error.value = new Error('加載 YouTube API 失敗')
        }
        else {
          run(YT)
        }
      }
      setTimeout(() => {
        if (!YT) {
          error.value = new Error('加載 YouTube API 超時')
        }
      }, 5000)
    }
    else {
      run(YT)
    }
  })

  let timer: ReturnType<typeof setTimeout> | undefined

  function run(YT: YouTube) {
    player.value?.destroy()
    const width = document.getElementById('player')!.clientWidth
    player.value = markRaw(new YT.Player('player', {
      width,
      height: width * 9 / 16,
      videoId: data.youtube,
      playerVars: {
        autoplay: autoplay ? 1 : 0,
        cc_lang_pref: 0,
        enablejsapi: 1,
        color: 'white',
        iv_load_policy: 3,
      },
      events: {
        onReady() {
          updateCurrent()
          if (timer)
            clearInterval(timer)
          timer = setInterval(() => {
            updateCurrent()
          }, 50)
        },
        onStateChange() {
          updateCurrent()
          if (settings.value.loopSong && status.value === 'ended') {
            player.value?.seekTo(0)
          }
        },
        onError(e) {
          error.value = e
        },
      },
    }))
  }

  let pausedAt = 0

  const active = ref<{
    index: number
    start: number
    end: number
  } | null>(null)

  function updateActive() {
    let n: number | null = null
    for (let i = 0; i < data.lyrics.length; i++) {
      if (current.value < data.lyrics[i]!.t + offset.value) {
        break
      }
      n = i
    }

    if (n == null) {
      active.value = null
      return
    }
    else if (n !== active.value?.index) {
      pausedAt = 0
    }

    if (active.value?.index === n)
      return

    const next = data.lyrics[n + 1]
    active.value = {
      index: n,
      start: data.lyrics[n]!.t + offset.value,
      end: next ? (next.t + offset.value) : duration.value,
    }
  }

  function reload() {
    if (YT)
      run(YT)
  }

  function play() {
    updateActive()
    player.value?.playVideo()
  }

  function toggle() {
    if (status.value === 'playing') {
      player.value?.pauseVideo()
    }
    else {
      play()
    }
  }

  function updateCurrent() {
    if (!player.value)
      return
    duration.value = player.value.getDuration() || 0
    status.value = player.value.getPlayerState() === YT!.PlayerState.PLAYING
      ? 'playing'
      : player.value.getPlayerState() === YT!.PlayerState.PAUSED
        ? 'paused'
        : player.value.getPlayerState() === YT!.PlayerState.ENDED
          ? 'ended'
          : 'loading'
    current.value = player.value.getCurrentTime() || 0
    if (settings.value.autoPause && status.value === 'playing' && active.value && current.value >= active.value.end && pausedAt < 1) {
      current.value = active.value.end
      player.value.seekTo(current.value)
      player.value.pauseVideo()
      pausedAt = active.value.index
    }
    else {
      if (status.value === 'playing') {
        updateActive()
      }
    }
  }

  function go(input: number | LyricLine | undefined, autoPlay = true) {
    if (input == null)
      return
    const st = typeof input === 'number'
      ? input
      : input.t + offset.value
    player.value?.seekTo(st, true)
    if (autoPlay)
      player.value?.playVideo()
    current.value = st
    updateActive()
    pausedAt = 0
  }

  onUnmounted(() => {
    if (timer)
      clearInterval(timer)
  })

  const controls = {
    player,
    current,
    duration,
    go,
    status,
    active,
    play,
    toggle,
    error,
    reload,
  }

  provide('player', controls)

  return controls
}

export function getPlayer() {
  return inject<PlayerControls>('player')
}
