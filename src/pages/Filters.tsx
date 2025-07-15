import { useRef, useState } from "react";
import { Outlet, useNavigate, useSearchParams } from "react-router-dom";

const statusOptions = ["alive", "dead", "unknown"];
const genderOptions = ["female", "male", "genderless", "unknown"];

interface Filters {
  name: string;
  status: string;
  gender: string;
}

export default function Filters() {
  const [searchParams] = useSearchParams();
  const filters = {
    name: searchParams.get("name") || "",
    status: searchParams.get("status") || "",
    gender: searchParams.get("gender") || "",
  };
  const [name, setName] = useState(filters.name);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navigate = useNavigate();

  const updateFilters = (key: keyof Filters, value: string) => {
    const newFilters = { ...filters, [key]: value };

    const params = new URLSearchParams();
    if (newFilters.name) params.set("name", newFilters.name);
    if (newFilters.status) params.set("status", newFilters.status);
    if (newFilters.gender) params.set("gender", newFilters.gender);

    navigate({
      pathname: "/",
      search: params.toString(),
    });
  };

  const handleChangeName = (newName: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setName(newName);
    timeoutRef.current = setTimeout(() => {
      updateFilters("name", newName);
    }, 500);
  };
  return (
    <>
      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Search..."
          value={name}
          onChange={(e) => handleChangeName(e.target.value)}
          className="border p-2 rounded flex-1"
        />

        <select
          value={filters.status}
          onChange={(e) => updateFilters("status", e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All statuses</option>
          {statusOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>

        <select
          value={filters.gender}
          onChange={(e) => updateFilters("gender", e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All genders</option>
          {genderOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      <Outlet />
    </>
  );
}
