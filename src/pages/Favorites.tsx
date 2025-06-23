import { useEffect, useState } from "react";
import CharacterCard from "../components/CharacterCard";
import { useAuthStore } from "../store/authStore";
import type { Character } from "../constants/types";

export default function Favorites() {
  const userId = useAuthStore((state) => state.userId);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;

    const favData = JSON.parse(localStorage.getItem("favorites") || "{}");
    let userFavorites = (favData[userId] || []) as {
      id: number;
      favoritedAt: string;
    }[];

    if (userFavorites.length === 0) return;

    // Сортируем по дате добавления
    userFavorites = userFavorites.sort(
      (a, b) =>
        new Date(b.favoritedAt).getTime() - new Date(a.favoritedAt).getTime()
    );

    const ids = userFavorites.map((entry) => entry.id);

    const fetchFavoriteCharacters = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `https://rickandmortyapi.com/api/character/${ids.join(",")}`
        );
        const data = await res.json();
        const results: Character[] = Array.isArray(data) ? data : [data];

        // Восстанавливаем порядок
        const ordered = ids
          .map((id) => results.find((char) => char.id === id))
          .filter(Boolean) as Character[];

        setCharacters(ordered);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteCharacters();
  }, [userId]);

  return (
    <div className="mt-6">
      <h2 className="text-2xl font-bold mb-4">Favorites</h2>
      {characters.length === 0 && <p>No favorites yet.</p>}
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ${
          loading && "opacity-50"
        }`}
      >
        {characters.map((char) => (
          <CharacterCard key={char.id} {...char} />
        ))}
      </div>
    </div>
  );
}
