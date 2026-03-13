import { auth } from "../firebase";

export async function authorizedFetch(url, options = {}) {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("You must be logged in.");
  }

  const token = await user.getIdToken();
  const headers = new Headers(options.headers || {});
  headers.set("Authorization", `Bearer ${token}`);

  return fetch(url, {
    ...options,
    headers,
  });
}
