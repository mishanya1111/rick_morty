import { useEffect, useState } from "react";

type Mas = (string | null)[][];

const doublerArraytoArray = (mas: Mas): (string | null)[] => {
  const result = [];
  for (let i = 0; i < mas.length; i++) {
    for (let j = 0; j < mas[i].length; j++) {
      result.push(mas[i][j]);
    }
  }
  return result;
};

export default function Tag({ tagSize = 3 }: { tagSize?: number }) {
  console.log(tagSize);

  const [mas, setMas] = useState<Mas>(
    Array.from({ length: tagSize }, () => [])
  );

  const [moves, setMoves] = useState(0);

  const generateRandomBoard = (size: number): (string | null)[][] => {
    const values: (string | null)[] = Array.from(
      { length: size * size - 1 },
      (_, i) => (i + 1).toString()
    );

    for (let i = values.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [values[i], values[j]] = [values[j], values[i]];
    }

    values.push(null);

    const board: Mas = [];
    for (let i = 0; i < size; i++) {
      board.push(values.slice(i * size, (i + 1) * size));
    }

    return board;
  };

  const reset = () => {
    let newMas = generateRandomBoard(mas.length);
    while (!checkСorrectness(newMas)) {
      newMas = generateRandomBoard(mas.length);
    }
    setMoves(0);
    setMas(newMas);
  };

  const handleClick = (i: number, j: number) => {
    if (mas[i][j] === null) return;

    const newMas = mas.map((row) => row.slice());
    const directions = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ];
    for (const [di, dj] of directions) {
      const ni = i + di;
      const nj = j + dj;

      if (
        ni >= 0 &&
        ni < newMas.length &&
        nj >= 0 &&
        nj < newMas.length &&
        newMas[ni][nj] === null
      ) {
        setMoves((mov) => mov + 1);
        newMas[ni][nj] = newMas[i][j];
        newMas[i][j] = null;
        setMas(newMas);
        return;
      }
    }
  };

  const moveByKey = (key: string) => {
    const directions: Record<string, [number, number]> = {
      ArrowUp: [1, 0],
      ArrowDown: [-1, 0],
      ArrowLeft: [0, 1],
      ArrowRight: [0, -1],
    };

    if (!(key in directions)) return;

    const size = mas.length;
    let emptyI = -1;
    let emptyJ = -1;

    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (mas[i][j] === null) {
          emptyI = i;
          emptyJ = j;
          break;
        }
      }
    }

    const [di, dj] = directions[key];
    const ni = emptyI + di;
    const nj = emptyJ + dj;

    if (ni >= 0 && ni < size && nj >= 0 && nj < size) {
      setMoves((mov) => mov + 1);
      const newMas = mas.map((row) => row.slice());
      newMas[emptyI][emptyJ] = newMas[ni][nj];
      newMas[ni][nj] = null;
      setMas(newMas);
    }
  };

  const checkWin = (mas: Mas): boolean => {
    let prev;
    let cur;
    const arr = doublerArraytoArray(mas);
    for (let i = 0; i < arr.length; i++) {
      if (i == arr.length - 1) return true;
      prev = cur;
      cur = arr[i];
      if (Number(cur) < Number(prev)) return false;
    }
    return true;
  };

  const checkСorrectness = (mas: Mas): boolean => {
    const arr = doublerArraytoArray(mas);
    let inversion = 0;

    for (let i = 0; i < arr.length - 1; i++) {
      for (let j = i + 1; j < arr.length - 1; j++) {
        if (Number(arr[i]) > Number(arr[j])) {
          inversion++;
        }
      }
    }

    if (mas.length % 2 == 0) {
      if ((inversion + 1) % 2 == 1) return true;
      else return false;
    } else {
      return inversion % 2 == 0;
    }
  };

  useEffect(() => {
    let newMas = generateRandomBoard(tagSize);
    while (!checkСorrectness(newMas)) {
      newMas = generateRandomBoard(tagSize);
    }
    setMoves(0);
    setMas(newMas);
  }, [tagSize]);

  const win = checkWin(mas);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      moveByKey(e.key);
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [mas, win]);

  return (
    <div className="m-6">
      <div className="flex">
        <button
          onClick={reset}
          className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Reset
        </button>
        <div className="mb-4 px-4 py-2"> Moves: {moves}</div>
        {win && <div className="mb-4 px-4 py-2"> Win</div>}
      </div>

      <div className={win ? "opacity-70" : ""}>
        <table className="border-collapse border border-gray-400">
          <tbody>
            {mas.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, colIndex) => (
                  <td
                    key={colIndex}
                    className={`w-12 h-12 border border-gray-400 text-center align-middle ${
                      cell && "cursor-pointer"
                    }`}
                    onClick={() => handleClick(rowIndex, colIndex)}
                  >
                    {cell ?? ""}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
