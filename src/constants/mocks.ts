import { URL_CHARACTER } from "./URL";
const base = `${URL_CHARACTER}?`;
const memory = base + "name=Memory";
const alive = base + "name=Memory&status=alive";
const female = base + "name=Memory&gender=female";
const dead_female = base + "name=Memory&status=dead&gender=female";
const favorites = URL_CHARACTER + "3,2,1";
export const characterMockResponses = {
  [base]: "base",
  [memory]: "memory",
  [alive]: "alive",
  [female]: "dead_female",
  [dead_female]: "dead_female",
  [favorites]: "favorites",
};
export const mockData: Record<string, unknown> = {
  base: {
    info: {
      count: 826,
      pages: 42,
      next: "https://rickandmortyapi.com/api/character/?page=2",
      prev: null,
    },
    results: [
      {
        id: 1,
        name: "Rick Sanchez",
        status: "Alive",
        species: "Human",
        type: "",
      },
      {
        id: 2,
        name: "Morty Smith",
        status: "Alive",
        species: "Human",
        type: "",
      },
      {
        id: 3,
        name: "Summer Smith",
        status: "Alive",
        species: "Human",
        type: "",
      },
      {
        id: 4,
        name: "Beth Smith",
        status: "Alive",
        species: "Human",
        type: "",
      },
      {
        id: 5,
        name: "Jerry Smith",
        status: "Alive",
        species: "Human",
        type: "",
      },
      {
        id: 6,
        name: "Abadango Cluster Princess",
        status: "Alive",
        species: "Alien",
        type: "",
      },
      {
        id: 7,
        name: "Abradolf Lincler",
        status: "unknown",
        species: "Human",
        type: "Genetic experiment",
      },
      {
        id: 8,
        name: "Adjudicator Rick",
        status: "Dead",
        species: "Human",
        type: "",
      },
      {
        id: 9,
        name: "Agency Director",
        status: "Dead",
        species: "Human",
        type: "",
      },
      {
        id: 10,
        name: "Alan Rails",
        status: "Dead",
        species: "Human",
        type: "Superhuman (Ghost trains summoner)",
      },
      {
        id: 11,
        name: "Albert Einstein",
        status: "Dead",
        species: "Human",
        type: "",
      },
      { id: 12, name: "Alexander", status: "Dead", species: "Human", type: "" },
      {
        id: 13,
        name: "Alien Googah",
        status: "unknown",
        species: "Alien",
        type: "",
      },
      {
        id: 14,
        name: "Alien Morty",
        status: "unknown",
        species: "Alien",
        type: "",
      },
      {
        id: 15,
        name: "Alien Rick",
        status: "unknown",
        species: "Alien",
        type: "",
      },
      {
        id: 16,
        name: "Amish Cyborg",
        status: "Dead",
        species: "Alien",
        type: "Parasite",
      },
      { id: 17, name: "Annie", status: "Alive", species: "Human", type: "" },
      {
        id: 18,
        name: "Antenna Morty",
        status: "Alive",
        species: "Human",
        type: "Human with antennae",
      },
      {
        id: 19,
        name: "Antenna Rick",
        status: "unknown",
        species: "Human",
        type: "Human with antennae",
      },
      {
        id: 20,
        name: "Ants in my Eyes Johnson",
        status: "unknown",
        species: "Human",
        type: "Human with ants in his eyes",
      },
    ],
  },

  memory: {
    info: {
      count: 6,
      pages: 1,
      next: null,
      prev: null,
    },
    results: [
      {
        id: 779,
        name: "Young Memory Rick",
        status: "Alive",
        species: "Human",
        type: "Memory",
      },
      {
        id: 780,
        name: "Memory Tammy",
        status: "Dead",
        species: "Human",
        type: "Memory",
      },
      {
        id: 782,
        name: "Memory Squanchy",
        status: "Dead",
        species: "Alien",
        type: "Memory",
      },
      {
        id: 783,
        name: "Memory Rick",
        status: "Dead",
        species: "Human",
        type: "Memory",
      },
      {
        id: 784,
        name: "Memory Rick",
        status: "Dead",
        species: "Human",
        type: "Memory",
      },
      {
        id: 785,
        name: "Memory Geardude",
        status: "Dead",
        species: "Alien",
        type: "Memory",
      },
    ],
  },

  alive: {
    info: {
      count: 1,
      pages: 1,
      next: null,
      prev: null,
    },
    results: [
      {
        id: 779,
        name: "Young Memory Rick",
        status: "Alive",
        species: "Human",
        type: "Memory",
      },
    ],
  },

  dead_female: {
    info: {
      count: 1,
      pages: 1,
      next: null,
      prev: null,
    },
    results: [
      {
        id: 780,
        name: "Memory Tammy",
        status: "Dead",
        species: "Human",
        type: "Memory",
      },
    ],
  },
  favorites: [
    {
      id: 1,
      name: "Rick Sanchez",
      status: "Alive",
      species: "Human",
      type: "",
    },
    {
      id: 2,
      name: "Morty Smith",
      status: "Alive",
      species: "Human",
      type: "",
    },
    {
      id: 3,
      name: "Summer Smith",
      status: "Alive",
      species: "Human",
      type: "",
    },
  ],
} as const;
