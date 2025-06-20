import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "./useAuthContext";

export const useLogin = () => {
  const navigate = useNavigate();
  const { dispatch } = useAuthContext();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleUserRedirect = (userRole) => {
    console.log("🟡 USER ROLE FROM handleUserRedirect : ", userRole);
    if (
      [
        "super-admin",
        "scolarity-admin",
        "certification-admin",
        "financial-admin",
        "lms-admin",
        "community-admin",
      ].includes(userRole)
    ) {
      userRole = "admin";
    }

    navigate(`/${userRole}Dashboard`);
    // if (userRole === "teacher") {
    //   navigate("/teacherDashboard");
    // } else if (userRole === "student") {
    //   navigate("/studentDashboard");
    // } else if ([
    //   "super-admin",
    //   "scolarity-admin",
    //   "certification-admin",
    //   "financial-admin",
    //   "lms-admin",
    //   "community-admin",
    // ].includes(userRole)) {
    //   navigate("/adminDashboard");
    // }
  };

  useEffect(() => {
    return () => {};
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);
    let redirectedUser = null

    axios
      .post("/users/login", { email, password })
      .then((response) => {
        const json = response.data;

        if (response.status === 200) {
          localStorage.setItem("user", JSON.stringify(json));
          if (
            [
              "super-admin",
              "scolarity-admin",
              "certification-admin",
              "financial-admin",
              "lms-admin",
              "community-admin",
            ].includes(json.user.role)
          ) {
            redirectedUser = "admin";
          } else { redirectedUser = json.user.role}


          dispatch({ type: "LOGIN", payload: json });
          console.log("🔵 USER ROLE FROM USELOGIN : ", json.user.role);  
          navigate(`/${redirectedUser}Dashboard`);

    
        } else {
          setError(json.error);
        }
      })
      .catch((error) => {
        if (error.response) {
          toast.error(error.response.data.message);
        } else {
          setError("An error occurred during login");
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return { login, isLoading, error };
};
