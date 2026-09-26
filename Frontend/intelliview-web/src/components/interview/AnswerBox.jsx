import { Edit3, Mic, Square, Trash2 } from 'lucide-react'
import { useState } from 'react'

function AnswerBox({
  value,
  onChange,
  disabled,
  speech,
}) {
  const [mode, setMode] = useState('type')

  const speakingMode = mode === 'speak'

  const speechState = speech.isProcessing
    ? 'Receiving speech…'
    : speech.isListening
      ? 'Listening…'
      : 'Microphone ready'

  return (
    <section
      className="answer-box glass-panel"
      aria-label="Your answer"
    >
      {/* Header */}
      <div className="answer-box__heading">
        <span>Your answer</span>

        <div
          className="answer-mode"
          role="tablist"
          aria-label="Answer input mode"
        >
          <button
            type="button"
            role="tab"
            aria-selected={!speakingMode}
            className={
              !speakingMode
                ? 'answer-mode__button answer-mode__button--active'
                : 'answer-mode__button'
            }
            onClick={() => setMode('type')}
            disabled={disabled}
          >
            <Edit3 size={13} />
            Type Answer
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={speakingMode}
            className={
              speakingMode
                ? 'answer-mode__button answer-mode__button--active'
                : 'answer-mode__button'
            }
            onClick={() => setMode('speak')}
            disabled={disabled}
          >
            <Mic size={13} />
            Speak Answer
          </button>
        </div>
      </div>

      {/* Speech-to-text panel */}
      {speakingMode && (
        <div className="speech-panel">
          {!speech.isSupported ? (
            <p className="speech-panel__message">
              Speech-to-text isn't supported in this browser.
              You can type your answer instead.
            </p>
          ) : (
            <>
              <div className="speech-panel__status">
                <span
                  className={
                    speech.isListening
                      ? 'speech-status speech-status--listening'
                      : 'speech-status'
                  }
                >
                  <i />
                  {speechState}
                </span>

                <div>
                  <button
                    className="speech-button"
                    type="button"
                    onClick={speech.toggleListening}
                    disabled={disabled}
                    aria-label={
                      speech.isListening
                        ? 'Stop speaking'
                        : 'Start speaking'
                    }
                    title={
                      speech.isListening
                        ? 'Stop speaking'
                        : 'Start speaking'
                    }
                  >
                    {speech.isListening ? (
                      <Square size={14} />
                    ) : (
                      <Mic size={14} />
                    )}

                    {speech.isListening
                      ? 'Stop Speaking'
                      : 'Start Speaking'}
                  </button>

                  <button
                    className="speech-icon-button"
                    type="button"
                    onClick={speech.clearTranscript}
                    disabled={disabled || !value}
                    aria-label="Clear transcript"
                    title="Clear transcript"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              {speech.error && (
                <p
                  className="speech-panel__error"
                  role="status"
                >
                  {speech.error}
                </p>
              )}
            </>
          )}
        </div>
      )}

      {/* Answer textarea */}
      <label className="answer-box__field">
        <span className="sr-only">
          Answer text
        </span>

        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={
            speakingMode
              ? 'Your live transcript will appear here. You can edit it at any time.'
              : 'Type your answer here...'
          }
          maxLength={10000}
          disabled={disabled}
        />
      </label>

      {/* Character count */}
      <small>
        {value.length.toLocaleString()} / 10,000
      </small>
    </section>
  )
}

export default AnswerBox
