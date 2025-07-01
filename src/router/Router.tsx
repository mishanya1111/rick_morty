// src/router/Router.tsx
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./Root/Root";
import Filters from "../pages/Filters";
import Home from "../pages/Home";
import CharactersList from "../pages/CharactersList";
import History from "../pages/History";
import { SignIn } from "../pages/SignIn";
import { SignUp } from "../pages/SignUp";
import CharacterDetail from "../pages/CharacterDetail";
import Favorites from "../pages/Favorites";
import Tag from "../pages/Tag";
import { TagPage } from "../pages/TagPage";

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
            element: <Home />,
          },
          {
            path: "/search",
            element: <CharactersList />,
          },
        ],
      },
      {
        path: "/signin",
        element: <SignIn />,
      },
      {
        path: "/signup",
        element: <SignUp />,
      },
      {
        path: "/characters/:id",
        element: <CharacterDetail />,
      },
      {
        path: "/history",
        element: <History />,
      },
      {
        path: "/favorites",
        element: <Favorites />,
      },
      {
        path: "/tag",
        element: <TagPage />,
      },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
