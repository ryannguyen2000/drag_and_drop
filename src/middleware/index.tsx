import React, {useEffect, useState} from "react";
import {Navigate, Outlet, useLocation, useNavigate} from "react-router-dom";
import {GetACookie} from "../utilities/cookies";

const Middleware = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [allow, setAllow] = useState(false);

//   useEffect(() => {
//     const check = async () => {
//       if (!GetACookie("dcid") && location.pathname === "/editor") {
//         await setTimeout(() => {
//           setAllow(false);
//         }, 500);
//         return;
//       }
//       setAllow(true);
//     };
//     check();
//   }, [location, navigate]);

//   if (!allow) {
//     return <Navigate to="/" state={{from: location}} replace />;
//   }

  return <Outlet />;
};

export default Middleware;
