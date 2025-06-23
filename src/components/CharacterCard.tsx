import { Link } from "react-router-dom";
import type { Character } from "../constants/types";
import hearth from "../assets/heart.png";
import { useAuthStore } from "../store/authStore";

export default function CharacterCard({
  name,
  image,
  species,
  id,
  buttonVisibility = true,
}: Character) {
  const userId = useAuthStore((state) => state.userId);
  const handleAddToFavorites = () => {
    if (!userId) return;

    const favData = JSON.parse(localStorage.getItem("favorites") || "{}");
    let userFavorites = favData[userId] || [];

    // Проверим, добавлен ли уже
    const exists = userFavorites.some((item: any) => item.id === id);
    if (!exists) {
      userFavorites.push({ id, favoritedAt: new Date().toISOString() });
      favData[userId] = userFavorites;
      localStorage.setItem("favorites", JSON.stringify(favData));
    }
  };

  return (
    <div className="border rounded-xl shadow p-4 flex flex-col items-center gap-2 relative">
      {buttonVisibility && (
        <button
          onClick={handleAddToFavorites}
          className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:text-accent-foreground h-9 w-9 absolute z-10 top-5 right-5 rounded-full text-red-500 transition-all hover:bg-red-500/10 active:bg-red-500/30"
        >
          <img src={hearth} alt="значёк сердца для подписки" />
        </button>
      )}
      <img
        src={image}
        alt={name}
        className="w-full h-48 object-cover rounded z-1"
      />
      <div className="flex w-full justify-between">
        <p className="text-lg font-semibold">{name}</p>
        <span className="bg-black text-white text-xs px-2 py-1 rounded">
          {species}
        </span>
      </div>
      {buttonVisibility && (
        <Link to={`/characters/${id}`} className="mt-2 w-full">
          <button className="w-full bg-gray-200 hover:bg-gray-300 px-4 py-1 rounded text-sm">
            READ MORE
          </button>
        </Link>
      )}
    </div>
  );
}
