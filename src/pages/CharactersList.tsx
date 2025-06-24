import { useEffect, useState } from "react";
import { useSearchParams, useLocation } from "react-router-dom";
import CharacterCard from "../components/CharacterCard";
import type { Character, Filters } from "../constants/types";
import { useAuthStore } from "../store/authStore";
import { markFavorites } from "../utils/favorites";
import { URL_CHARACTER } from "../constants/URL";

export default function CharactersList() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const userId = useAuthStore((state) => state.userId);

  const filters: Filters = {
    name: searchParams.get("name") || "",
    status: searchParams.get("status") || "",
    gender: searchParams.get("gender") || "",
  };

  const fetchCharacters = async ({ name, status, gender }: Filters) => {
    const params = new URLSearchParams();
    if (name) params.append("name", name);
    if (status) params.append("status", status);
    if (gender) params.append("gender", gender);

    setLoading(true);
    setError("");

    try {
      const res = await fetch(URL_CHARACTER + `?${params.toString()}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      const rawCharacters: Character[] = data.results || [];

      let marked = userId
        ? markFavorites(rawCharacters, userId)
        : rawCharacters;
      if (!Array.isArray(marked)) {
        marked = [marked];
      }
      setCharacters(marked);
    } catch (err: any) {
      console.error(err);
      setError(err.message);
      setCharacters([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCharacters(filters);
  }, [location.search, userId]);

  return (
    <div className="mt-6">
      {error && <p className="text-red-500">Sorry... We found nothing. :(</p>}
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ${
          loading && "opacity-50"
        }`}
      >
        {characters.map((char) => (
          <CharacterCard
            key={char.id}
            {...char}
            buttonVisibility={!!userId}
            isFavorite={char.isFavorite}
          />
        ))}
      </div>
    </div>
  );
}
