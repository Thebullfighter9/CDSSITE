import { useState, useEffect } from "react";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  department: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// Mock user data - replace with real API calls
const MOCK_USERS: Record<string, { password: string; user: User }> = {
  "admin@circuitdreamsstudios.com": {
    password: "admin123",
    user: {
      id: "1",
      email: "admin@circuitdreamsstudios.com",
      name: "Alex Chen",
      role: "Admin",
      department: "Management",
    },
  },
  "dev@circuitdreamsstudios.com": {
    password: "dev123",
    user: {
      id: "2",
      email: "dev@circuitdreamsstudios.com",
      name: "Maya Rodriguez",
      role: "Developer",
      department: "Engineering",
    },
  },
  "designer@circuitdreamsstudios.com": {
    password: "design123",
    user: {
      id: "3",
      email: "designer@circuitdreamsstudios.com",
      name: "Jordan Kim",
      role: "Designer",
      department: "Creative",
    },
  },
};

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem("cds_user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setAuthState({
          user,
          isLoading: false,
          isAuthenticated: true,
        });
      } catch {
        localStorage.removeItem("cds_user");
        setAuthState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
        });
      }
    } else {
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
    }
  }, []);

  const login = async (
    email: string,
    password: string,
  ): Promise<{ success: boolean; error?: string }> => {
    setAuthState((prev) => ({ ...prev, isLoading: true }));

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const userRecord = MOCK_USERS[email];

    if (!userRecord || userRecord.password !== password) {
      setAuthState((prev) => ({ ...prev, isLoading: false }));
      return { success: false, error: "Invalid email or password" };
    }

    const { user } = userRecord;
    localStorage.setItem("cds_user", JSON.stringify(user));

    setAuthState({
      user,
      isLoading: false,
      isAuthenticated: true,
    });

    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem("cds_user");
    setAuthState({
      user: null,
      isLoading: false,
      isAuthenticated: false,
    });
  };

  return {
    ...authState,
    login,
    logout,
  };
}
