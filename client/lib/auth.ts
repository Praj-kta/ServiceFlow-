// Check if user is logged in
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem("authToken");
};

// Get logged in user ID
export const getUserId = (): string | null => {
  return localStorage.getItem("userId");
};

// Get logged in user role
export const getUserRole = (): string | null => {
  return localStorage.getItem("userRole");
};

// Logout helper
export const logout = (): void => {
  localStorage.clear();
  window.location.href = "/login-user";
};

// Require authentication (for protected pages)
export const requireAuth = (redirectUrl: string = "/login-user"): void => {
  const token = localStorage.getItem("authToken");

  if (!token) {
    localStorage.clear();
    window.location.replace(redirectUrl);
    // Do not throw; redirect and stop further execution
  }
};

// Require specific role (admin / provider etc.)
export const requireRole = (
  role: string,
  redirectUrl: string = "/login-user"
): void => {
  const userRole = localStorage.getItem("userRole");

  if (!userRole || userRole !== role) {
    window.location.replace(redirectUrl);
    throw new Error("Insufficient permissions");
  }
};