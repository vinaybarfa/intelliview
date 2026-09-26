import api from '../lib/api'

const unwrap = (response) => response.data

export async function getInterviews() {
  return unwrap(await api.get('/api/interviews'))
}

export async function startInterview({ targetRole, questionCount }) {
  return unwrap(await api.post('/api/interviews', { targetRole, questionCount }))
}

export async function submitAnswer(interviewId, questionId, answerText) {
  return unwrap(await api.post(`/api/interviews/${interviewId}/questions/${questionId}/answer`, { answerText }))
}

export async function completeInterview(interviewId) {
  return unwrap(await api.post(`/api/interviews/${interviewId}/complete`))
}

export async function getInterviewReport(interviewId) {
  return unwrap(await api.get(`/api/interviews/${interviewId}/report`))
}