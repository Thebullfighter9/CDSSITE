import { useState, useEffect } from "react";
import ApiService from "@/services/api";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  position: string;
  isAdmin: boolean;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  useEffect(() => {
    // Check for existing session
    const token = localStorage.getItem("cds_token");
    const storedUser = localStorage.getItem("cds_user");

    if (token && storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setAuthState({
          user,
          isLoading: false,
          isAuthenticated: true,
        });

        // Verify token is still valid by fetching current user
        ApiService.getCurrentUser()
          .then((currentUser) => {
            const updatedUser = {
              id: currentUser.id,
              email: currentUser.email,
              name: currentUser.name,
              role: currentUser.role,
              position: currentUser.position,
              isAdmin: currentUser.isAdmin,
            };
            localStorage.setItem("cds_user", JSON.stringify(updatedUser));
            setAuthState({
              user: updatedUser,
              isLoading: false,
              isAuthenticated: true,
            });
          })
          .catch(() => {
            // Token invalid, clear auth
            localStorage.removeItem("cds_token");
            localStorage.removeItem("cds_user");
            setAuthState({
              user: null,
              isLoading: false,
              isAuthenticated: false,
            });
          });
      } catch {
        localStorage.removeItem("cds_token");
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

    try {
      const response = await ApiService.login(email, password);

      const user = {
        id: response.user.id,
        email: response.user.email,
        name: response.user.name,
        role: response.user.role,
        position: response.user.position,
        isAdmin: response.user.isAdmin,
      };

      localStorage.setItem("cds_token", response.token);
      localStorage.setItem("cds_user", JSON.stringify(user));

      setAuthState({
        user,
        isLoading: false,
        isAuthenticated: true,
      });

      return { success: true };
    } catch (error: any) {
      setAuthState((prev) => ({ ...prev, isLoading: false }));

      // Development mode fallback for CEO login
      if (
        email === "AlexDowling@circuitdreamsstudios.com" &&
        password === "Hz3492k5$!" &&
        (error.message.includes("fetch") ||
          error.message.includes("Failed to fetch"))
      ) {
        console.warn("🔧 Backend unavailable - using development mode for CEO");

        const devUser = {
          id: "dev-ceo-1",
          email: "AlexDowling@circuitdreamsstudios.com",
          name: "Alex Dowling",
          role: "CEO",
          position: "Chief Executive Officer",
          isAdmin: true,
        };

        localStorage.setItem("cds_token", "dev-token");
        localStorage.setItem("cds_user", JSON.stringify(devUser));

        setAuthState({
          user: devUser,
          isLoading: false,
          isAuthenticated: true,
        });

        return { success: true };
      }

      return {
        success: false,
        error: error.message || "Login failed. Please check your credentials.",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("cds_token");
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
