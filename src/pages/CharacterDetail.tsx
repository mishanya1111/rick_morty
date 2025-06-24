import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { isFavorite, toggleFavorite } from "../utils/favorites";
import heart from "../assets/heart.png";
import heartFilled from "../assets/heart-filled.png";
import { URL_CHARACTER } from "../constants/URL";

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
  const [fav, setFav] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(URL_CHARACTER + id);
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
          userHistory[existingIndex] = newEntry;
        } else {
          userHistory.push(newEntry);
        }

        history[userId] = userHistory;
        localStorage.setItem("history", JSON.stringify(history));

        setFav(isFavorite(userId, data.id));
      }
    };

    fetchData();
  }, [id, userId]);

  const handleFavClick = () => {
    if (!userId || !character) return;
    toggleFavorite(userId, character.id);
    setFav((prev) => !prev);
  };

  if (loading || !character) return <p>Loading...</p>;

  return (
    <div className="flex flex-col md:flex-row gap-4 border rounded-xl shadow p-6 bg-gradient-to-r from-green-300 to-green-100 mx-auto mt-10 relative">
      {userId && (
        <button
          onClick={handleFavClick}
          className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:text-accent-foreground h-9 w-9 absolute z-10 top-5 right-5 rounded-full text-red-500 transition-all hover:bg-red-500/10 active:bg-red-500/30"
        >
          <img
            src={fav ? heartFilled : heart}
            alt="значок избранного"
            className="w-6 h-6"
          />
        </button>
      )}

      <img
        src={character.image}
        alt={character.name}
        className="h-[350px] ml-[15px] object-cover rounded-xl"
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
        <section className="flex flex-col justify-around font-bold">
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
