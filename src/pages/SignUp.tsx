import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { generateId } from "../utils/generateId";
import { useAuthStore } from "../store/authStore";

export function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!name) newErrors.name = "Name is required";
    if (!email) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";
    if (password !== confirmPassword)
      newErrors.confirm = "Confirm password is required";
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const users = JSON.parse(localStorage.getItem("users") || "{}");
    if (users[email]) {
      alert("User already exists");
      return;
    }

    const id = generateId();
    users[email] = { id, password, name };
    localStorage.setItem("users", JSON.stringify(users));

    login(id);
    navigate("/");
  };

  return (
    <div className="flex items-center justify-center px-4">
      <div className="w-full max-w-md my-10">
        <h2 className="text-2xl font-bold mb-2">Sign Up</h2>
        <p className="mb-6">
          Already have an account?{" "}
          <Link to="/signin" className="text-black font-semibold">
            Sign In.
          </Link>
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Name"
              className="w-full border px-3 py-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
          </div>
          <div>
            <input
              type="email"
              placeholder="Email Address"
              className="w-full border px-3 py-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              className="w-full border px-3 py-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}
          </div>
          <div>
            <input
              type="password"
              placeholder="Password Confirmation"
              className="w-full border px-3 py-2"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {errors.confirm && (
              <p className="text-red-500 text-sm">{errors.confirm}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}
