import { createContext, useContext, useEffect, useState } from "react";
import { loginRequest } from "../services/authService";

const AuthContext = createContext(null);
const storageKey = "hcl-library-auth";

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => {
    const raw = localStorage.getItem(storageKey);
    return raw ? JSON.parse(raw) : { token: null, user: null };
  });

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(session));
  }, [session]);

  const login = async (payload) => {
    const data = await loginRequest(payload);
    setSession(data);
    return data;
  };

  const logout = () => {
    setSession({ token: null, user: null });
  };

  return (
    <AuthContext.Provider
      value={{
        token: session.token,
        user: session.user,
        isAuthenticated: Boolean(session.token),
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
