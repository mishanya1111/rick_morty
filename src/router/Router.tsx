import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./Root/Root";
import Filters from "../pages/Filters";
import CharactersList from "../pages/CharactersList";
import History from "../pages/History";
import { SignIn } from "../pages/SignIn";
import { SignUp } from "../pages/SignUp";
import Favorites from "../pages/Favorites";
import { TagPage } from "../pages/TagPage";
import CharacterDetail from "../pages/CharacterDetail";

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
      {
        path: "/characters/:id",
        element: <CharacterDetail />,
      },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
