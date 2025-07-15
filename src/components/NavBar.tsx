import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import icon from "../assets/rick_morty_icon.png";

export function NavBar() {
  const userId = useAuthStore((state) => state.userId);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const logoutHandle = () => {
    logout();
    navigate("/signin/");
  };

  const linkClassName = ({ isActive }: { isActive: boolean }) =>
    `text-sm hover:text-gray-800 ${
      isActive ? "underline underline-offset-4" : ""
    }`;

  return (
    <nav className="flex justify-between items-center px-8 py-4 border-b shadow-sm">
      {/* Logo */}
      <Link to="/" className="text-xl font-bold">
        <img src={icon} className="h-12" alt="icon rick & morty" />
      </Link>

      {/* Navigation links */}
      <div className="flex space-x-6 items-center">
        <NavLink to="/" end className={linkClassName}>
          Search
        </NavLink>

        {!userId ? (
          <NavLink to="/signin/" end className={linkClassName}>
            Sign In
          </NavLink>
        ) : (
          <>
            <NavLink to="/tag/" end className={linkClassName}>
              Tag
            </NavLink>
            <NavLink to="/history/" end className={linkClassName}>
              History
            </NavLink>
            <NavLink to="/favorites/" end className={linkClassName}>
              Favorites
            </NavLink>
            <button
              onClick={logoutHandle}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-black text-white shadow hover:bg-primary/90 h-9 px-4 py-2"
            >
              Log Out
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
