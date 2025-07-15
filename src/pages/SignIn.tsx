import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem("users") || "{}");
    const user = users[email];

    if (!user || user.password !== password) {
      setError("Invalid email or password");
      return;
    }

    login(user.id);
    navigate("/");
  };

  return (
    <div className="flex items-center justify-center px-4">
      <div className="w-full max-w-md my-10">
        <h2 className="text-2xl font-bold mb-6">Sign In</h2>
        <p className="mb-6">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-black font-semibold">
            Sign Up.
          </Link>
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email Address"
            className="w-full border px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full border px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
