import { Outlet } from "react-router-dom";
import { NavBar } from "../../components/NavBar";

const Root = () => {
  return (
    <div>
      <header>
        <NavBar />
      </header>
      <main className="mx-10 my-4">
        <Outlet />
      </main>
    </div>
  );
};

export default Root;
