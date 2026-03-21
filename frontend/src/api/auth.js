import { apiRequest } from "./client.js";

export function registerUser(credentials) {
  return apiRequest("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}

export function loginUser(credentials) {
  return apiRequest("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}

export function fetchCurrentUser(token) {
  return apiRequest("/api/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
