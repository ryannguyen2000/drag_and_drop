import React, {Component, FC, ReactNode, Suspense} from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  RouteProps,
} from "react-router-dom";
import Middleware from "../middleware";

type RouteConfig = {
  path: string;
  value: string;
  title: string;
  icon: string;
  element: ReactNode;
};

type RootProviderProps = {
  routers: RouteConfig[];
};

const RootProvider: FC<RootProviderProps> = ({routers}) => {
  return routers?.length > 0 ? (
    <Router>
      <Suspense fallback={<>Loading...</>}>
        <Routes>
          <Route element={<Middleware />}>
            {routers.map((route, index) => (
              <Route key={index} path={route.path} element={route.element} />
            ))}
          </Route>
        </Routes>
      </Suspense>
    </Router>
  ) : null;
};

export default RootProvider;
