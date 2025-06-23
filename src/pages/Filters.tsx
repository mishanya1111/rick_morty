import React, { useEffect, useState } from "react";
import {
  Outlet,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

const statusOptions = ["alive", "dead", "unknown"];
const genderOptions = ["female", "male", "genderless", "unknown"];

type Filters = {
  name: string;
  status: string;
  gender: string;
};

export default function Filters() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  const filters = {
    name: searchParams.get("name") || "",
    status: searchParams.get("status") || "",
    gender: searchParams.get("gender") || "",
  };

  // const fetchCharacters = ({ name, status, gender }: Filters) => {
  //   const params = new URLSearchParams();
  //   if (name) params.append("name", name);
  //   if (status) params.append("status", status);
  //   if (gender) params.append("gender", gender);

  //   const url = `https://rickandmortyapi.com/api/character/?${params.toString()}`;
  //   console.log("🔍 Fetch URL:", url);

  //   fetch(url)
  //     .then((res) => {
  //       if (!res.ok) throw new Error(`HTTP ${res.status}`);
  //       return res.json();
  //     })
  //     .then((data) => console.log("✅ Data received:", data))
  //     .catch((err) => console.error("❌ Fetch error:", err));
  // };

  // fetchCharacters(filters);

  const updateFilters = (key: keyof Filters, value: string) => {
    const newFilters = { ...filters, [key]: value };

    console.log(location.pathname);

    // Формируем параметры запроса без пустых значений
    const params = new URLSearchParams();
    if (newFilters.name) params.set("name", newFilters.name);
    if (newFilters.status) params.set("status", newFilters.status);
    if (newFilters.gender) params.set("gender", newFilters.gender);

    // Навигация с новым query
    navigate({
      pathname: "/search/",
      search: params.toString(),
    });
  };

  return (
    <>
      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Search..."
          value={filters.name}
          onChange={(e) => updateFilters("name", e.target.value)}
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
