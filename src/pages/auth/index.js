import React, { useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
//
import Login from "./Login";
import Signup from "./Signup";

function AuthView() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (["/", "auth/login"].includes(location.pathname)) {
      navigate("/auth/login");
    }
  }, [location, navigate]);

  return (
    <Routes>
      <Route path="auth/login" element={<Login />} />
      <Route path="auth/signup" element={<Signup />} />
    </Routes>
  );
}

export default AuthView;
