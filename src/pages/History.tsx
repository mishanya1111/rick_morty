import { useEffect, useState } from "react";
import CharacterCard from "../components/CharacterCard";
import type { Character } from "../constants/types";
import { useAuthStore } from "../store/authStore";

export default function History() {
  const userId = useAuthStore((state) => state.userId);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;

    const historyData = JSON.parse(localStorage.getItem("history") || "{}");
    let userHistory = (historyData[userId] || []) as {
      id: number;
      viewedAt: string;
    }[];

    if (userHistory.length === 0) return;

    userHistory = userHistory.sort(
      (a, b) => new Date(b.viewedAt).getTime() - new Date(a.viewedAt).getTime()
    );
    console.log(userHistory);

    // Получаем массив id в правильном порядке
    const ids: number[] = userHistory.map((entry: { id: number }) => entry.id);
    if (ids.length === 0) return;
    // console.log(ids);

    const fetchHistoryCharacters = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `https://rickandmortyapi.com/api/character/${ids.join(",")}`
        );
        const data = await res.json();
        const results: Character[] = Array.isArray(data) ? data : [data];
        //console.log(results);

        // Восстанавливаем порядок по ids
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

    fetchHistoryCharacters();
  }, [userId]);

  return (
    <div className="mt-6">
      <h2 className="text-2xl font-bold mb-4">History</h2>
      {characters.length === 0 && <p>History is empty.</p>}
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
