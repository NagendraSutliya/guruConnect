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

      // ✅ TEACHER SUPPORT
      if (savedRole === "teacher") {
        const teacher = localStorage.getItem("teacher");
        if (teacher && teacher !== "undefined") {
          setUser(JSON.parse(teacher));
        }
      }

      // ✅ STUDENT SUPPORT
      if (savedRole === "student") {
        const student = localStorage.getItem("student");
        if (student && student !== "undefined") {
          setUser(JSON.parse(student));
        }
      }
    } catch (err) {
      console.error("Auth load error:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("admin");
    localStorage.removeItem("teacher");
    localStorage.removeItem("student");
    localStorage.removeItem("token");
    setUser(null);
    setRole(null);
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
