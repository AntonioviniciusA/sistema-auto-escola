import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const useAuth = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const payload = jwtDecode(token);
        const isExpired = payload.exp * 1000 < Date.now();

        if (!isExpired) {
          setUser(payload);
        } else {
          localStorage.removeItem("token");
          setUser(null);
          navigate("/");
        }
      } catch (error) {
        console.error("Invalid token", error);
        localStorage.removeItem("token");
        setUser(null);
      }
    }
  }, []);

  return { user };
};

export default useAuth;
