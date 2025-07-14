import { useEffect, useState, useCallback, useRef } from "react";
import { useSearchParams, useLocation } from "react-router-dom";
import CharacterCard from "./CharacterCard";
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
  const [nextPageUrl, setNextPageUrl] = useState<string | null>(null);

  const observerRef = useRef<HTMLDivElement | null>(null);

  const userId = useAuthStore((state) => state.userId);

  const filters: Filters = {
    name: searchParams.get("name") || "",
    status: searchParams.get("status") || "",
    gender: searchParams.get("gender") || "",
  };

  const fetchCharacters = useCallback(
    async (url?: string, isLoadMore = false) => {
      const params = new URLSearchParams();
      if (filters.name) params.append("name", filters.name);
      if (filters.status) params.append("status", filters.status);
      if (filters.gender) params.append("gender", filters.gender);

      const finalUrl = url || `${URL_CHARACTER}?${params.toString()}`;

      setLoading(true);
      setError("");

      try {
        const res = await fetch(finalUrl);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        const rawCharacters: Character[] = data.results || [];

        let marked = userId
          ? markFavorites(rawCharacters, userId)
          : rawCharacters;

        if (!Array.isArray(marked)) {
          marked = [marked];
        }

        setCharacters((prev) => (isLoadMore ? [...prev, ...marked] : marked));
        setNextPageUrl(data.info?.next || null);
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error(err);
          setError(err.message);
        } else {
          setError("Unknown error");
        }
      } finally {
        setLoading(false);
      }
    },
    [filters.name, filters.status, filters.gender, userId]
  );

  useEffect(() => {
    setCharacters([]);
    fetchCharacters();
    setNextPageUrl(null);
  }, [location.search, fetchCharacters]);

  useEffect(() => {
    const target = observerRef.current;
    if (!target || !nextPageUrl || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchCharacters(nextPageUrl, true);
        }
      },
      {
        rootMargin: "200px",
      }
    );

    observer.observe(target);

    return () => {
      if (target) observer.unobserve(target);
    };
  }, [nextPageUrl, loading, fetchCharacters]);

  return (
    <div className="mt-6">
      {error && <p className="text-red-500">Sorry... We found nothing. :(</p>}

      <div
        className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ${
          loading ? "opacity-50" : ""
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

      {loading && <p className="text-center my-4">Loading...</p>}

      <div ref={observerRef} className="h-1" />
    </div>
  );
}
