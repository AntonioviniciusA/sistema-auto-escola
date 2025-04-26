import { useEffect, useState } from "react";

const useAuth = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = token ? JSON.parse(atob(token.split(".")[1])) : null;
    setUser(userData);
  }, []);

  return { user };
};

export default useAuth;
