import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      setLoading(false);
      return;
    }

    api.get<User>("/api/auth/me")
      .then((data) => {
        setUser(data);
      })
      .catch(() => {
        localStorage.clear();
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const logout = () => {
    localStorage.clear();
    setUser(null);
    window.location.href = "/login-user";
  };

  return {
    user,
    loading,
    isAuthenticated: !!user,
    logout,
  };
}