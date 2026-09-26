import api from "../lib/api";

const unwrap = (response) => response.data;

export async function getJobs() {
  return unwrap(await api.get("/api/jobs"));
}

export async function getJob(jobId) {
  return unwrap(await api.get(`/api/jobs/${jobId}`));
}
