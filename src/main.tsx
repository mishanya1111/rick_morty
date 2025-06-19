import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import AppRouter from "../src/router/Router";
import App from "./App";
import Filters from "./components/Filters.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* <div className="m-5">
      <Filters/>
    </div> */}
    {/*<App/>*/}
    <AppRouter />
  </StrictMode>
);
