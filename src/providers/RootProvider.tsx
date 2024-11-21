import React, {Component, FC, Suspense} from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  RouteProps,
} from "react-router-dom";
import {HomePage} from "../pages";

type RouteConfig = {
  path: string;
  element: React.ComponentType;
};

type RootProviderProps = {
  routers: RouteConfig[];
};

const RootProvider: FC<RootProviderProps> = ({routers}) => {
  return routers?.length > 0 ? (
    <Router>
      <Suspense fallback={<>Loading...</>}>
        <Routes>
          {routers.map((route, index) => (
            <Route key={index} path="/" element={<route.element />} />
          ))}
        </Routes>
      </Suspense>
    </Router>
  ) : null;
};

export default RootProvider;
