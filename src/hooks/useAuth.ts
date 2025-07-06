import { useState, useEffect, useCallback } from "react";
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

// Valid internal roles that can log in
const VALID_ROLES = ["CEO", "Admin", "TeamLead", "Employee"];

// Session timeout (1 hour)
const SESSION_TIMEOUT = 60 * 60 * 1000; // 1 hour in milliseconds

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  // Auto logout on session timeout or inactivity
  const setupSessionTimeout = useCallback(() => {
    const lastActivity = sessionStorage.getItem("cds_last_activity");
    if (lastActivity) {
      const timeSinceActivity = Date.now() - parseInt(lastActivity);
      if (timeSinceActivity > SESSION_TIMEOUT) {
        logout();
        return;
      }
    }

    // Update last activity
    sessionStorage.setItem("cds_last_activity", Date.now().toString());

    // Set timeout for session expiry
    setTimeout(() => {
      logout();
    }, SESSION_TIMEOUT);
  }, []);

  // Track user activity to extend session
  const updateActivity = useCallback(() => {
    sessionStorage.setItem("cds_last_activity", Date.now().toString());
  }, []);

  // Clear session completely
  const clearSession = useCallback(() => {
    sessionStorage.removeItem("cds_token");
    sessionStorage.removeItem("cds_user");
    sessionStorage.removeItem("cds_last_activity");
    localStorage.removeItem("cds_token");
    localStorage.removeItem("cds_user");
  }, []);

  // Logout function
  const logout = useCallback(async () => {
    try {
      // Invalidate token on server if possible
      const token = sessionStorage.getItem("cds_token");
      if (token && token !== "dev-token") {
        await ApiService.logout();
      }
    } catch (error) {
      // Continue with logout even if server request fails
    } finally {
      clearSession();
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });

      // Force redirect to login
      window.location.href = "/";
    }
  }, [clearSession]);

  useEffect(() => {
    // Check for existing session (prioritize sessionStorage for security)
    const token =
      sessionStorage.getItem("cds_token") || localStorage.getItem("cds_token");
    const storedUser =
      sessionStorage.getItem("cds_user") || localStorage.getItem("cds_user");

    if (token && storedUser) {
      try {
        const user = JSON.parse(storedUser);

        // Validate user has a valid role
        if (!VALID_ROLES.includes(user.role)) {
          clearSession();
          setAuthState({
            user: null,
            isLoading: false,
            isAuthenticated: false,
          });
          return;
        }

        // Check session timeout
        const lastActivity = sessionStorage.getItem("cds_last_activity");
        if (lastActivity) {
          const timeSinceActivity = Date.now() - parseInt(lastActivity);
          if (timeSinceActivity > SESSION_TIMEOUT) {
            logout();
            return;
          }
        }

        // Skip API verification for development tokens
        if (token === "dev-token") {
          setupSessionTimeout();
          updateActivity();
          setAuthState({
            user,
            isLoading: false,
            isAuthenticated: true,
          });
        } else {
          // Verify token is still valid by fetching current user
          ApiService.getCurrentUser()
            .then((currentUser) => {
              // Validate role from server response
              if (!VALID_ROLES.includes(currentUser.role)) {
                throw new Error("Invalid role");
              }

              const updatedUser = {
                id: currentUser.id,
                email: currentUser.email,
                name: currentUser.name,
                role: currentUser.role,
                position: currentUser.position,
                isAdmin: currentUser.isAdmin,
              };

              // Store in sessionStorage for security (cleared on tab close)
              sessionStorage.setItem("cds_user", JSON.stringify(updatedUser));
              sessionStorage.setItem("cds_token", token);
              setupSessionTimeout();
              updateActivity();

              setAuthState({
                user: updatedUser,
                isLoading: false,
                isAuthenticated: true,
              });
            })
            .catch(() => {
              // Token invalid, clear auth
              clearSession();
              setAuthState({
                user: null,
                isLoading: false,
                isAuthenticated: false,
              });
            });
        }
      } catch {
        clearSession();
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

    // Listen for storage changes across tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "cds_token" && !e.newValue) {
        // Token was removed in another tab, logout this tab too
        logout();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Auto logout when tab/window closes (beforeunload event)
    const handleBeforeUnload = () => {
      clearSession();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [logout, setupSessionTimeout, updateActivity, clearSession]);

  const login = async (
    email: string,
    password: string,
  ): Promise<{ success: boolean; error?: string }> => {
    setAuthState((prev) => ({ ...prev, isLoading: true }));

    try {
      const response = await ApiService.login(email, password);

      // Validate user role from server response
      if (!VALID_ROLES.includes(response.user.role)) {
        setAuthState((prev) => ({ ...prev, isLoading: false }));
        return {
          success: false,
          error:
            "Access denied. This account does not have the required permissions.",
        };
      }

      const user = {
        id: response.user.id,
        email: response.user.email,
        name: response.user.name,
        role: response.user.role,
        position: response.user.position,
        isAdmin: response.user.isAdmin,
      };

      // Store in sessionStorage for security (cleared on tab close)
      sessionStorage.setItem("cds_token", response.token);
      sessionStorage.setItem("cds_user", JSON.stringify(user));
      setupSessionTimeout();
      updateActivity();

      setAuthState({
        user,
        isLoading: false,
        isAuthenticated: true,
      });

      return { success: true };
    } catch (error: any) {
      setAuthState((prev) => ({ ...prev, isLoading: false }));

      // Development mode fallback for CEO login only
      if (
        email === "AlexDowling@circuitdreamsstudios.com" &&
        password === "Hz3492k5$!"
      ) {
        const devUser = {
          id: "dev-ceo-1",
          email: "AlexDowling@circuitdreamsstudios.com",
          name: "Alex Dowling",
          role: "CEO",
          position: "Chief Executive Officer",
          isAdmin: true,
        };

        sessionStorage.setItem("cds_token", "dev-token");
        sessionStorage.setItem("cds_user", JSON.stringify(devUser));
        setupSessionTimeout();
        updateActivity();

        setAuthState({
          user: devUser,
          isLoading: false,
          isAuthenticated: true,
        });

        return { success: true };
      }

      // Limited development accounts for testing (only valid internal roles)
      const devAccounts = {
        "dev@circuitdreamsstudios.com": {
          password: "dev123",
          user: {
            id: "dev-2",
            email: "dev@circuitdreamsstudios.com",
            name: "Maya Rodriguez",
            role: "Admin",
            position: "Head of Development",
            isAdmin: true,
          },
        },
        "employee@circuitdreamsstudios.com": {
          password: "emp123",
          user: {
            id: "dev-3",
            email: "employee@circuitdreamsstudios.com",
            name: "Jordan Kim",
            role: "Employee",
            position: "UI/UX Designer",
            isAdmin: false,
          },
        },
        "teamlead@circuitdreamsstudios.com": {
          password: "lead123",
          user: {
            id: "dev-4",
            email: "teamlead@circuitdreamsstudios.com",
            name: "Alex Johnson",
            role: "TeamLead",
            position: "Development Team Lead",
            isAdmin: false,
          },
        },
      };

      const devAccount = devAccounts[email];
      if (devAccount && devAccount.password === password) {
        sessionStorage.setItem("cds_token", "dev-token");
        sessionStorage.setItem("cds_user", JSON.stringify(devAccount.user));
        setupSessionTimeout();
        updateActivity();

        setAuthState({
          user: devAccount.user,
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

  // Activity tracking for session extension
  useEffect(() => {
    if (authState.isAuthenticated) {
      const events = [
        "mousedown",
        "mousemove",
        "keypress",
        "scroll",
        "touchstart",
        "click",
      ];

      const updateActivityOnEvent = () => {
        updateActivity();
      };

      events.forEach((event) => {
        document.addEventListener(event, updateActivityOnEvent, true);
      });

      return () => {
        events.forEach((event) => {
          document.removeEventListener(event, updateActivityOnEvent, true);
        });
      };
    }
  }, [authState.isAuthenticated, updateActivity]);

  return {
    ...authState,
    login,
    logout,
    updateActivity,
  };
}
