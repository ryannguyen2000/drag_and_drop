import React, {useEffect} from "react";
import {Outlet, useLocation, useNavigate} from "react-router-dom";
import {GetACookie} from "../utilities/cookies";

const Middleware = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!GetACookie("dcid") && location.pathname === "/editor") navigate("/");
  }, [location, navigate]);

  return <Outlet />;
};

export default Middleware;
