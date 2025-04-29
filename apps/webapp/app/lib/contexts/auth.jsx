import { createContext, useContext } from "react";

const AuthContext = createContext();

function auth() {
  return useContext(AuthContext);
}

function AuthProvider({ children, user }) {

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthProvider, auth };
