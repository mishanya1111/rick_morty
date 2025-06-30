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

export default function Tag() {
  const [mas, setMas] = useState<Mas>([[], [], [], []]);

  useEffect(() => reset(), []);

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
        newMas[ni][nj] = newMas[i][j];
        newMas[i][j] = null;
        setMas(newMas);
        return;
      }
    }
  };

  const checkWin = (mas: Mas): boolean => {
    let prev;
    let cur;
    const arr = doublerArraytoArray(mas);
    for (let i = 0; i < arr.length; i++) {
      prev = cur;
      cur = arr[i];
      if (i == arr.length - 1) return true;
      if (Number(cur) < Number(prev)) return false;
    }
    return true;
  };

  const checkСorrectness = (mas: Mas): boolean => {
    const arr = doublerArraytoArray(mas);
    let collision = 0;

    for (let i = 0; i < arr.length - 1; i++) {
      for (let j = i + 1; j < arr.length - 1; j++) {
        if (Number(arr[i]) > Number(arr[j])) {
          collision++;
        }
      }
    }

    if (mas.length % 2 == 0) {
      if ((collision + 1) % 2 == 1) return true;
      else return false;
    } else {
      return collision % 2 == 0;
    }
  };
  const tagLen = mas.length;
  const win = mas[tagLen - 1][tagLen - 1] === null ? checkWin(mas) : false;

  return (
    <div className="m-6">
      <div className="flex">
        <button
          onClick={reset}
          className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Reset
        </button>
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
