// src/router/Router.tsx
import { createBrowserRouter, Form, RouterProvider } from "react-router-dom";
import Root from "./Root/Root";
import Filters from "../components/Filters";

const router = createBrowserRouter([
  {
    path: "",
    //errorElement: <ErrorPage />,
    element: <Root />,
    children: [
      {
        path: "",
        element: <Filters />,
        children: [
          {
            index: true,
            element: <div>base</div>,
          },
          {
            path: "/search",
            element: <div>Search</div>,
          },
        ],
      },
      {
        path: "/search",
        element: <div></div>,
      },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
