const BASE_URL = ""; // or from env

function basicAuthHeader(username, password) {
  const bytes = new TextEncoder().encode(`${username}:${password}`);
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return `Basic ${btoa(bin)}`;
}

/**
 * Attempts Basic Auth against /api/user/token.
 * Returns parsed JSON if available, otherwise null.
 * Throws Error on any non-OK response.
 */
export default async function getUserAuth(username, password) {
  const url = `${BASE_URL}/api/user/token`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: basicAuthHeader(username, password),
    },
    credentials: "include",
  });

  if (res.code === 401) {
    const err = new Error("Invalid username or password.");
    err.code = "INVALID_CREDENTIALS";
    throw err;
  }
  // Success: try to parse JSON; if none, return null
  try {
    return await res.json();
  } catch {
    return null;
  }
}
