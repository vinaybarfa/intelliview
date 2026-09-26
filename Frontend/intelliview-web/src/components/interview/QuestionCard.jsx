import { MessageSquareText } from 'lucide-react'
import { motion } from 'framer-motion'

function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
}) {
  return (
    <motion.section
      className="question-card glass-panel"
      key={question.questionId}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <span className="question-card__label">
        <MessageSquareText size={14} />
        Question {questionNumber} of {totalQuestions}
      </span>

      <h1>{question.questionText}</h1>

      <p>{question.questionType}</p>
    </motion.section>
  )
}

export default QuestionCard
