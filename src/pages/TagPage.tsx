import { useState } from "react";
import Tag from "../components/Tag";

export default function TagPage() {
  const [len, setLen] = useState(4);
  const [tagSize, setTagSize] = useState(4);

  const handleApply = () => {
    setTagSize(len);
  };
  return (
    <div className="flex flex-col items-center justify-center px-4">
      <form className="flex gap-3 p-4" onSubmit={(e) => e.preventDefault()}>
        <label htmlFor="input-len">Tag length:</label>
        <input
          className="border"
          type="number"
          onChange={(e) => setLen(Number(e.target.value))}
          value={len}
          min={2}
          id="input-len"
        />
      </form>
      <button
        id="apply"
        className="border p-3 rounded-full bg-blue-100"
        onClick={() => handleApply()}
      >
        Apply length
      </button>

      <Tag tagSize={tagSize} />
    </div>
  );
}
