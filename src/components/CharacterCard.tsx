import { Link } from "react-router-dom";
import hearth from "../assets/heart.png";
import heartFilled from "../assets/heart-filled.png";
import { useAuthStore } from "../store/authStore";
import { toggleFavorite } from "../utils/favorites";
import type { Character } from "../constants/types";
import { useState } from "react";

interface Props extends Character {
  buttonVisibility?: boolean;
  onFavoriteToggle?: (userId: string, id: number) => void;
}

export default function CharacterCard({
  name,
  image,
  species,
  id,
  onFavoriteToggle = toggleFavorite,
  buttonVisibility = true,
  isFavorite = false,
}: Props) {
  const userId = useAuthStore((state) => state.userId);
  const [fav, setFav] = useState(isFavorite);

  const handleFavoriteClick = () => {
    if (!userId) return;
    onFavoriteToggle(userId, id);
    setFav((prev) => !prev);
  };

  return (
    <div
      className="border rounded-xl shadow p-4 flex flex-col items-center gap-2 relative"
      data-testid="character-card"
    >
      {buttonVisibility && (
        <button
          onClick={handleFavoriteClick}
          className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:text-accent-foreground h-9 w-9 absolute z-10 top-5 right-5 rounded-full text-red-500 transition-all hover:bg-red-500/10 active:bg-red-500/30"
        >
          <img
            src={fav ? heartFilled : hearth}
            alt={fav ? "in Favorite" : "not in Favorite"}
            className="w-6 h-6"
          />
        </button>
      )}

      <img
        src={image}
        alt={name}
        className="w-full h-48 object-cover rounded z-1"
      />
      <div className="flex w-full justify-between">
        <p className="text-lg font-semibold">{name}</p>
        <span className="bg-black text-white text-xs px-2 py-1 rounded flex text-center items-center">
          {species}
        </span>
      </div>

      <Link to={`/characters/${id}`} className="mt-2 w-full">
        <button className="w-full bg-gray-200 hover:bg-gray-300 px-4 py-1 rounded text-sm">
          READ MORE
        </button>
      </Link>
    </div>
  );
}
