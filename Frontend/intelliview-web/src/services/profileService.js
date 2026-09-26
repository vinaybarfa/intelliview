import api from "../lib/api";

const payload = (response) => response.data?.data;

export async function getProfile() {
  return payload(await api.get("/api/users/profile"));
}

export async function updateProfile(profile) {
  return payload(await api.put("/api/users/profile", profile));
}
