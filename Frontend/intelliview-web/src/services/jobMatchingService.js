import api from '../lib/api'

const unwrap = (response) => response.data

export async function getJobMatches() {
  return unwrap(await api.get('/api/job-matches'))
}

export async function matchJob(jobId, resumeId) {
  const response = await api.post(`/api/jobs/${jobId}/match`, { resumeId })
  return response.data
}