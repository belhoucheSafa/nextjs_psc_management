import { useState, useEffect } from "react";

export const useAuthSync = () => {
  const [authState, setAuthState] = useState(() => {
    const userData = localStorage.getItem("userData");
    return {
      userRole: userData ? JSON.parse(userData).role : null,
      isAuthenticated: !!localStorage.getItem("authToken"),
    };
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const userData = localStorage.getItem("userData");
      setAuthState({
        userRole: userData ? JSON.parse(userData).role : null,
        isAuthenticated: !!localStorage.getItem("authToken"),
      });
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return authState;
};
