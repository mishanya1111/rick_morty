import CharactersList from "../components/CharactersList";
import Filters from "./Filters";

export default function Home() {
  return (
    <>
      <Filters />
      <CharactersList />
    </>
  );
}
