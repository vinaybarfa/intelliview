import api from "../lib/api";

// Keep the transport envelope at the API boundary.  Components should only
// receive the endpoint payload, never ApiResponse itself.
const payload = (response) => response.data?.data;

export async function getResumes() {
  return payload(await api.get("/api/resumes"));
}

export async function uploadResume(file, targetRole, jobTarget = {}) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("targetRole", targetRole);
  if (jobTarget.jobTitle) formData.append("jobTitle", jobTarget.jobTitle);
  if (jobTarget.company) formData.append("company", jobTarget.company);
  if (jobTarget.jobDescription)
    formData.append("jobDescription", jobTarget.jobDescription);
  return payload(await api.post("/api/resumes/upload", formData));
}

export async function getResumeAnalysis(resumeId) {
  return payload(await api.get(`/api/resumes/${resumeId}/analysis`));
}

export async function optimizeResume(resumeId) {
  return payload(await api.post(`/api/resumes/${resumeId}/optimize`));
}
