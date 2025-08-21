// services/authService.js

function basicAuthHeader(username, password) {
  const bytes = new TextEncoder().encode(`${username}:${password}`);
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return `Basic ${btoa(bin)}`;
}

export default async function getUserAuth(username, password) {
  const url = `/api/user/token`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: basicAuthHeader(username, password),
    },
  });

  // Fix: use res.status instead of res.code
  if (res.status === 401) {
    const err = new Error("Invalid username or password.");
    err.code = "INVALID_CREDENTIALS";
    throw err;
  }

  if (!res.ok) {
    throw new Error(`Login failed: ${res.status}`);
  }

  try {
    return await res.json();
  } catch {
    return null;
  }
}

// Check if user is authenticated (renamed from checkAuth to match our App component)
export async function checkAuthStatus() {
  try {
    const res = await fetch("/api/user/token", {
    method: "GET",
    credentials: "include",
    });
    return res.ok; // Return boolean for simpler usage in App component
  } catch {
    return false;
  }
}

// Original checkAuth for getting user data if needed elsewhere
export async function checkAuth() {
  try {
    const res = await fetch(`/api/user/me`, {
      credentials: "include",
    });
    if (res.ok) {
      return await res.json();
    }
    return null;
  } catch {
    return null;
  }
}

// Optional: Add logout function
export async function logoutUser() {
  try {
    const res = await fetch(`/api/user/logout`, {
      method: "POST",
      credentials: "include",
    });
    return res.ok;
  } catch (error) {
    console.error("Logout failed:", error);
    return false;
  }
}