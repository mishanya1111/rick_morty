import rickImage from "../assets/rick.png";

export default function Home() {
  return (
    <>
      <section>
        <div className=" flex justify-center flex-col items-center">
          <img src={rickImage} alt="img" className="mb-[50px]" />
          <p className="text-2xl text-black">
            There you can see all of the characters that appear in the Rick and
            Morty franchise.
          </p>
          <p className="text-2xl text-black">Start from search.</p>
        </div>
      </section>
    </>
  );
}
