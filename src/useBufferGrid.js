import { useState, useEffect } from 'react';
import SeedRandom from 'seedrandom';

const matrixOfSize = (size) => {
  return [...Array(size)].map(() => Array(size).fill(null));
};

const genRandomMatrix = (size, setGrid, { seed, density }) => {
  const random = seed.length ? new SeedRandom(seed) : new SeedRandom();
  setGrid(matrixOfSize(size).map((row) => row.map(() => (random() < Number(density) ? newCell() : null))));
};

const newCell = () => {
  return { age: 0 };
};

const computeNextState = (prev, next) => {
  next.forEach((row, i) => {
    row.forEach((_, j) => {
      const neighbors = totalNeighbors(j, i, prev);
      if (prev[i][j] && (neighbors < 2 || neighbors > 3)) {
        next[i][j] = null;
      } else if (!prev[i][j] && neighbors === 3) {
        next[i][j] = newCell();
      } else {
        next[i][j] = prev[i][j] ? { ...prev[i][j], age: prev[i][j].age + 1 } : null;
      }
    });
  });
};

const totalNeighbors = (x, y, prev) => {
  const neighborOffsets = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
  const total = neighborOffsets.reduce((acc, offset) => {
    return acc + (getOffsetNeighbor(offset, x, y, prev) ? 1 : 0);
  }, 0);
  return total;
};

const getOffsetNeighbor = (offset, x, y, prev) => {
  // ((n % m) + m) % m;
  const yPos = (((offset[0] + y) % prev.length) + prev.length) % prev.length;
  const xPos = (((offset[1] + x) % prev[0].length) + prev[0].length) % prev[0].length;
  return prev[yPos][xPos];
};

const useBufferGrid = (size) => {
  const [grid, setGrid] = useState(matrixOfSize(size));

  useEffect(() => {
    setGrid(matrixOfSize(size));
  }, [size]);

  const clearMatrix = () => {
    setGrid(matrixOfSize(size));
  };

  return {
    grid,
    computeNext: (prev) => computeNextState(prev, grid),
    genRandomMatrix: (randomConfig) => genRandomMatrix(size, setGrid, randomConfig),
    clearMatrix
  };
};

export default useBufferGrid;
