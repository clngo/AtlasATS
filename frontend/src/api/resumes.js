import { apiRequest } from "./client.js";

export function fetchUserResumes(token) {
  return apiRequest("/api/resumes", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function createResume(token, data) {
  return apiRequest("/api/resumes", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
}

export function fetchResumeById(token, resumeId) {
  return apiRequest(`/api/resumes/${resumeId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function fetchPublicResumes() {
  return apiRequest("/api/public-resumes");
}
