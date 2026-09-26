import { Bot, Circle } from 'lucide-react'

function InterviewHeader({ targetRole }) {
  return (
    <header className="interview-header">
      <div className="interview-header__brand">
        <span>
          <Bot size={18} />
        </span>

        <div>
          <small>INTELLIVIEW AI</small>
          <strong>Mock interview</strong>
        </div>
      </div>

      <div className="interview-header__role">
        <Circle size={7} fill="currentColor" />
        {targetRole}
      </div>
    </header>
  )
}

export default InterviewHeader
