export interface Character {
  id: number;
  name: string;
  image: string;
  species: string;
  buttonVisibility?: boolean;
}

export interface Filters {
  name: string;
  status: string;
  gender: string;
}
