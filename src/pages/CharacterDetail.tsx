import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

interface CharacterData {
  id: number;
  name: string;
  status: string;
  species: string;
  gender: string;
  origin: { name: string };
  location: { name: string };
  image: string;
}

export default function CharacterDetail() {
  const { id } = useParams();
  const userId = useAuthStore((state) => state.userId);
  const [character, setCharacter] = useState<CharacterData | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(
        `https://rickandmortyapi.com/api/character/${id}`
      );
      const data = await res.json();
      setCharacter(data);
      setLoading(false);

      if (userId) {
        const history = JSON.parse(localStorage.getItem("history") || "{}");
        let userHistory = history[userId] || [];

        const existingIndex = userHistory.findIndex(
          (entry: any) => entry.id === data.id
        );
        const newEntry = {
          id: data.id,
          viewedAt: new Date().toISOString(),
        };

        if (existingIndex !== -1) {
          // Заменяем старую запись новой с обновлённой датой
          userHistory[existingIndex] = newEntry;
        } else {
          userHistory.push(newEntry);
        }

        history[userId] = userHistory;
        localStorage.setItem("history", JSON.stringify(history));
      }
    };

    fetchData();
  }, [id, userId]);

  if (loading || !character) return <p>Loading...</p>;

  return (
    <div className="flex flex-col md:flex-row gap-4 border rounded-xl shadow p-6 bg-gradient-to-r from-green-300 to-green-100 max-w-3xl mx-auto mt-10">
      <img
        src={character.image}
        alt={character.name}
        className="w-60 h-60 object-cover rounded-xl"
      />
      <div className="flex">
        <section className="w-32 text-end mr-3 flex flex-col justify-around">
          <p className="text-3xl font-azonix">Name:</p>
          <p className="text-3xl">Status:</p>
          <p className="text-3xl">Species:</p>
          <p className="text-3xl">Gender:</p>
          <p className="text-3xl">Location:</p>
          <p className="text-3xl">Origin:</p>
        </section>
        <section className=" flex flex-col justify-around font-bold">
          <p className="text-3xl font-azonix">{character.name}</p>
          <p className="text-3xl">{character.status}</p>
          <p className="text-3xl">{character.species}</p>
          <p className="text-3xl">{character.gender}</p>
          <p className="text-3xl">{character.location.name}</p>
          <p className="text-3xl">{character.origin.name}</p>
        </section>
      </div>
    </div>
  );
}
