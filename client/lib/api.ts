// Use a runtime-configurable API base URL so the app works in dev, prod, and serverless (Netlify) environments.
// In development, Vite runs the Express backend on the same origin (default: /api).
// In production, the API is served from the same host as the frontend.
// In Netlify serverless builds, the API is available under /.netlify/functions/api.
const rawBaseUrl = import.meta.env.VITE_API_BASE_URL?.toString().trim();

// Pick a sensible default base URL depending on runtime environment
const defaultBaseUrl = '/api';
const netlifyBaseUrl = '/.netlify/functions/api';
const isNetlifyEnv =
  typeof window !== 'undefined' &&
  (window.location.pathname.startsWith('/.netlify/functions') ||
    window.location.hostname.endsWith('.netlify.app'));

export const BASE_URL = rawBaseUrl
  ? rawBaseUrl.endsWith('/api')
    ? rawBaseUrl
    : rawBaseUrl.endsWith('/')
    ? `${rawBaseUrl.slice(0, -1)}/api`
    : `${rawBaseUrl}/api`
  : isNetlifyEnv
  ? netlifyBaseUrl
  : defaultBaseUrl;


type RequestMethod = "GET" | "POST" | "PUT" | "DELETE";

async function request<T>(
  endpoint: string,
  method: RequestMethod = "GET",
  body?: any
): Promise<T> {
  const token = localStorage.getItem("authToken");

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  // Handle unauthorized
  if (response.status === 401) {
    localStorage.clear();
    window.location.href = "/login-user";
    throw new Error("Unauthorized");
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      message: "Something went wrong",
    }));

    // Surface the full URL + status to help diagnose 404/500 issues
    const errorMessage =
      typeof errorData === "object" && errorData !== null
        ? (errorData.message || errorData.error || JSON.stringify(errorData))
        : String(errorData);

    throw new Error(
      `${response.status} ${response.statusText}: ${errorMessage} (url=${BASE_URL}${endpoint})`
    );
  }

  return response.json();
}

export const api = {
  get: <T>(endpoint: string) => request<T>(endpoint, "GET"),
  post: <T>(endpoint: string, body: any) =>
    request<T>(endpoint, "POST", body),
  put: <T>(endpoint: string, body: any) =>
    request<T>(endpoint, "PUT", body),
  delete: <T>(endpoint: string) => request<T>(endpoint, "DELETE"),
};