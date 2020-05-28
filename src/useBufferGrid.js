import { useState, useEffect } from 'react';

const matrixOfSize = (size) => {
  return [...Array(size)].map(() => Array(size).fill(false));
};

const genRandomMatrix = (size, setGrid) => {
  setGrid(matrixOfSize(size).map((row) => row.map(() => Math.random() < 0.2)));
};

const computeNextState = (prev, next) => {
  next.forEach((row, i) => {
    row.forEach((_, j) => {
      const neighbors = totalNeighbors(j, i, prev);
      if (prev[i][j] && (neighbors < 2 || neighbors > 3)) {
        next[i][j] = false;
      } else if (!prev[i][j] && neighbors === 3) {
        next[i][j] = true;
      } else {
        next[i][j] = prev[i][j];
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

  return {
    grid,
    computeNext: (prev) => computeNextState(prev, grid),
    genRandomMatrix: () => genRandomMatrix(size, setGrid)
  };
};

export default useBufferGrid;
