import { useEffect, useState, useCallback } from "react";
import CharacterCard from "../components/CharacterCard";
import { useAuthStore } from "../store/authStore";
import type { Character } from "../constants/types";
import {
  getFavoriteIds,
  markFavorites,
  toggleFavorite,
} from "../utils/favorites";
import { URL_CHARACTER } from "../constants/URL";

export default function Favorites() {
  const userId = useAuthStore((state) => state.userId);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(false);

  const loadFavorites = useCallback(async () => {
    if (!userId) return;

    const ids = getFavoriteIds(userId);
    if (ids.length === 0) {
      setCharacters([]);
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(URL_CHARACTER + ids.join(","));
      const data = await res.json();
      const results: Character[] = Array.isArray(data) ? data : [data];

      const ordered = ids
        .map((id) => results.find((char) => char.id === id))
        .filter(Boolean) as Character[];

      const marked = markFavorites(ordered, userId);
      setCharacters(marked);
    } catch (e) {
      console.error("Failed to fetch favorite characters:", e);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const handleFavoriteToggle = (id: number) => {
    if (!userId) return;

    toggleFavorite(userId, id);
    loadFavorites(); // перезагружаем список
  };

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  return (
    <div className="mt-6">
      <h2 className="text-2xl font-bold mb-4">Favorites</h2>
      {characters.length === 0 && <p>No favorites yet.</p>}
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ${
          loading ? "opacity-50" : ""
        }`}
      >
        {characters.map((char) => (
          <CharacterCard
            key={char.id}
            {...char}
            isFavorite={char.isFavorite}
            buttonVisibility={!!userId}
            onFavoriteToggle={() => handleFavoriteToggle(char.id)}
          />
        ))}
      </div>
    </div>
  );
}
