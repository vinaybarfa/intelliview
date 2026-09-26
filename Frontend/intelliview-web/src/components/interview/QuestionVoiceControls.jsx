import {
  Pause,
  Play,
  Square,
  Volume2,
} from 'lucide-react'

function QuestionVoiceControls({
  questionText,
  voice,
}) {
  if (!voice.isSupported) {
    return (
      <p className="voice-controls__unsupported">
        Voice playback isn't supported in this browser.
      </p>
    )
  }

  return (
    <div
      className="voice-controls"
      aria-label="Question voice controls"
    >
      {voice.isSpeaking ? (
        <>
          <span
            className={
              voice.isPaused
                ? 'voice-controls__state'
                : 'voice-controls__state voice-controls__state--speaking'
            }
          >
            <i />
            {voice.isPaused
              ? 'Question paused'
              : 'AI interviewer is speaking'}
          </span>

          <div>
            {voice.isPaused ? (
              <button
                type="button"
                onClick={voice.resume}
                aria-label="Resume question"
                title="Resume question"
              >
                <Play size={15} />
                Resume
              </button>
            ) : (
              <button
                type="button"
                onClick={voice.pause}
                aria-label="Pause question"
                title="Pause question"
              >
                <Pause size={15} />
                Pause
              </button>
            )}

            <button
              type="button"
              onClick={voice.stop}
              aria-label="Stop question"
              title="Stop question"
            >
              <Square size={15} />
              Stop
            </button>
          </div>
        </>
      ) : (
        <button
          className="voice-controls__read"
          type="button"
          onClick={() => voice.speak(questionText)}
          aria-label="Read interview question aloud"
          title="Read interview question aloud"
        >
          <Volume2 size={16} />
          Read Question
        </button>
      )}

      {voice.error && (
        <p role="status">
          {voice.error}
        </p>
      )}
    </div>
  )
}

export default QuestionVoiceControls

