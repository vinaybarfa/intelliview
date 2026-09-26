import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'

const selectVoice = (voices) =>
  voices.find((voice) =>
    voice.lang
      ?.toLowerCase()
      .startsWith('en-us'),
  ) ||
  voices.find((voice) =>
    voice.lang
      ?.toLowerCase()
      .startsWith('en'),
  ) ||
  null

function useTextToSpeech() {
  const isSupported =
    typeof window !== 'undefined' &&
    'speechSynthesis' in window &&
    'SpeechSynthesisUtterance' in window

  const utteranceRef = useRef(null)
  const queueTimerRef = useRef(null)
  const generationRef = useRef(0)

  const [voices, setVoices] = useState([])
  const [isSpeaking, setSpeaking] = useState(false)
  const [isPaused, setPaused] = useState(false)
  const [error, setError] = useState('')

  const stop = useCallback(() => {
    if (!isSupported) return

    generationRef.current += 1

    window.clearTimeout(queueTimerRef.current)

    utteranceRef.current = null

    if (
      window.speechSynthesis.speaking ||
      window.speechSynthesis.pending ||
      window.speechSynthesis.paused
    ) {
      window.speechSynthesis.cancel()
    }

    setSpeaking(false)
    setPaused(false)
  }, [isSupported])

  const speak = useCallback(
    (text) => {
      if (!isSupported) {
        setError(
          "Voice playback isn't supported in this browser.",
        )
        return
      }

      const question = text?.trim()

      if (!question) return

      stop()

      const generation = generationRef.current

      setError('')

      // Chromium dispatches cancellation asynchronously.
      // Queue only after that event has settled so a new
      // user-requested utterance is not cancelled too.
      queueTimerRef.current = window.setTimeout(() => {
        if (generation !== generationRef.current) return

        const utterance =
          new window.SpeechSynthesisUtterance(question)

        utterance.lang =
          navigator.language || 'en-US'
        utterance.rate = 0.95
        utterance.pitch = 1
        utterance.voice = selectVoice(voices)

        utterance.onstart = () => {
          if (generation !== generationRef.current) return

          setSpeaking(true)
          setPaused(false)
        }

        utterance.onend = () => {
          if (generation !== generationRef.current) return

          utteranceRef.current = null
          setSpeaking(false)
          setPaused(false)
        }

        utterance.onerror = (event) => {
          if (import.meta.env.DEV) {
            console.debug(
              'Speech synthesis error:',
              event.error,
            )
          }

          if (
            generation !== generationRef.current ||
            event.error === 'canceled'
          ) {
            return
          }

          utteranceRef.current = null
          setSpeaking(false)
          setPaused(false)

          setError(
            `Voice playback failed${
              event.error
                ? ` (${event.error})`
                : ''
            }. Try reading the question again.`,
          )
        }

        utteranceRef.current = utterance

        window.speechSynthesis.speak(utterance)
      }, 0)
    },
    [isSupported, stop, voices],
  )

  const pause = useCallback(() => {
    if (
      isSupported &&
      window.speechSynthesis.speaking
    ) {
      window.speechSynthesis.pause()
      setPaused(true)
    }
  }, [isSupported])

  const resume = useCallback(() => {
    if (
      isSupported &&
      window.speechSynthesis.paused
    ) {
      window.speechSynthesis.resume()
      setPaused(false)
      setSpeaking(true)
    }
  }, [isSupported])

  useEffect(() => {
    if (!isSupported) return undefined

    const refreshVoices = () =>
      setVoices(
        window.speechSynthesis.getVoices(),
      )

    refreshVoices()

    window.speechSynthesis.addEventListener?.(
      'voiceschanged',
      refreshVoices,
    )

    return () => {
      window.speechSynthesis.removeEventListener?.(
        'voiceschanged',
        refreshVoices,
      )

      stop()
    }
  }, [isSupported, stop])

  return {
    isSupported,
    isSpeaking,
    isPaused,
    error,
    speak,
    stop,
    pause,
    resume,
  }
}

export default useTextToSpeech