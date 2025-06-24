import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

function NavLink({
  to,
  children,
  isActive = false,
}: {
  to: string;
  children: React.ReactNode;
  isActive?: boolean;
}) {
  return (
    <Link
      to={to}
      className={`text-sm hover:text-gray-800 ${
        isActive && "underline underline-offset-4"
      }`}
    >
      {children}
    </Link>
  );
}

export function NavBar() {
  const location = useLocation();
  const userId = useAuthStore((state) => state.userId);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const logoutHandle = () => {
    logout();
    navigate("/signin/");
  };
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="flex justify-between items-center px-8 py-4 border-b shadow-sm">
      {/* Logo */}
      <Link to="/" className="text-xl font-bold">
        REACT-39
      </Link>

      {/* Right-side links */}
      <div className="flex space-x-6 items-center">
        <NavLink to="/search/" isActive={isActive("/search/")}>
          Search
        </NavLink>

        {!userId ? (
          <NavLink to="/signin/" isActive={isActive("/signin/")}>
            Sign In
          </NavLink>
        ) : (
          <>
            <NavLink to="/history/" isActive={isActive("/history/")}>
              History
            </NavLink>
            <NavLink to="/favorites/" isActive={isActive("/favorites/")}>
              Favorites
            </NavLink>
            <button
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-black text-white shadow hover:bg-primary/90 h-9 px-4 py-2"
              onClick={logoutHandle}
            >
              Log Out
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
