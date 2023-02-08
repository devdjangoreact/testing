// ** Router imports
import { useRoutes, Navigate } from "react-router-dom";

// ** Layouts
import Layout from "../layouts/Layout";

// ** Router imports
import { lazy } from "react";

// ** GetRoutes
import { allRoutes } from "./routes";

import ErrorPage from "../views/pages/ErrorPage";

//DashBoard
import DashBoard from "../features/DashBoard";
import Term from "../features/terminal";
import Testing from "../features/testing";

const Router = () => {
  const routes = useRoutes([
    {
      path: "/",
      element: <Layout />,
      errorElement: <ErrorPage />,
      children: [
        { index: true, element: <DashBoard /> },
        { path: "dashboard", element: <DashBoard /> },
        {
          path: "terminal",
          element: <Term />,
        },
        {
          path: "testing",
          element: <Testing />,
        },
      ],
      ...allRoutes,
    },
  ]);

  return routes;
};

export default Router;
