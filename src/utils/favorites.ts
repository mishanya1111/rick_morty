const STORAGE_KEY = "favorites";

function getFavorites(userId: string): { id: number; favoritedAt: string }[] {
  const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");

  let favorites =
    (all[userId] as {
      id: number;
      favoritedAt: string;
    }[]) || [];

  if (favorites.length === 0) return [];
  favorites = favorites.sort(
    (a, b) =>
      new Date(b.favoritedAt).getTime() - new Date(a.favoritedAt).getTime()
  );
  return favorites;
}

function saveFavorites(
  userId: string,
  data: { id: number; favoritedAt: string }[]
) {
  const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  all[userId] = data;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

export function toggleFavorite(userId: string, id: number): void {
  if (!userId) return;

  const favorites = getFavorites(userId);
  const index = favorites.findIndex((item) => item.id === id);

  if (index !== -1) {
    favorites.splice(index, 1);
  } else {
    favorites.push({ id, favoritedAt: new Date().toISOString() });
  }

  saveFavorites(userId, favorites);
}

export function getFavoriteIds(userId: string): number[] {
  return getFavorites(userId).map((item) => item.id);
}

export function isFavorite(userId: string, id: number): boolean {
  return getFavoriteIds(userId).some((el) => el === id);
}
export function markFavorites<T extends { id: number }>(
  data: T[],
  userId: string
): (T & { isFavorite: boolean })[] {
  const ids = new Set(getFavoriteIds(userId));

  const mark = (item: T): T & { isFavorite: boolean } => ({
    ...item,
    isFavorite: ids.has(item.id),
  });

  return data.map(mark);
}
