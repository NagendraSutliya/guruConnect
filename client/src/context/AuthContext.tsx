import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const savedRole = localStorage.getItem("role");

      if (!savedRole) {
        setLoading(false);
        return;
      }

      setRole(savedRole);

      // ✅ ADMIN SUPPORT (your existing system)
      if (savedRole === "admin") {
        const admin = localStorage.getItem("admin");
        if (admin && admin !== "undefined") {
          setUser(JSON.parse(admin));
        }
      }

      // ✅ TEACHER SUPPORT (new system)
      if (savedRole === "teacher") {
        const teacher = localStorage.getItem("teacher");
        if (teacher && teacher !== "undefined") {
          setUser(JSON.parse(teacher));
        }
      }
    } catch (err) {
      console.error("Auth load error:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, loading, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
