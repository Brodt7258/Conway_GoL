import { useState, useEffect } from 'react';
import SeedRandom from 'seedrandom';

// generate 2d array
const matrixOfSize = (size) => {
  return [...Array(size)].map(() => Array(size).fill(null));
};

// populate 2d array with cells/null based on random algorithm
const genRandomMatrix = (size, setGrid, { seed, density }) => {
  const random = seed.length ? new SeedRandom(seed) : new SeedRandom();
  setGrid(matrixOfSize(size).map((row) => row.map(() => (random() < Number(density) ? newCell() : null))));
};

const newCell = (config = { age: 0, neighbors: [] }) => {
  return { age: config.age, neighbors: config.neighbors };
};

// build the state for this buffer based on the previous state
// all the game rules happen here
const computeNextState = (prev, next) => {
  next.forEach((row, i) => {
    row.forEach((_, j) => {
      const [neighbors, ages] = totalNeighbors(j, i, prev);
      if (prev[i][j] && (neighbors < 2 || neighbors > 3)) {
        next[i][j] = null;
      } else if (!prev[i][j] && neighbors === 3) {
        next[i][j] = newCell({ age: 0, neighbors: ages });
      } else {
        next[i][j] = prev[i][j] ? { ...prev[i][j], age: prev[i][j].age + 1, neighbors: ages } : null;
      }
    });
  });
};

const totalNeighbors = (x, y, prev) => {
  const neighborOffsets = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
  const total = neighborOffsets.reduce((acc, offset) => {
    const neighbor = getOffsetNeighbor(offset, x, y, prev);
    acc[0] += (neighbor ? 1 : 0);
    if (neighbor) {
      acc[1].push(neighbor.age);
    }
    return acc;
  }, [0, []]);
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

  // any time the size of the matrix changes, declare a new matrix of the correct size
  useEffect(() => {
    setGrid(matrixOfSize(size));
  }, [size]);

  const clearMatrix = () => {
    setGrid(matrixOfSize(size));
  };

  const mutateAt = (row, col) => {
    if (grid[row][col]) {
      grid[row][col] = null;
    } else {
      grid[row][col] = newCell();
    }
  };

  return {
    grid,
    computeNext: (prev) => computeNextState(prev, grid),
    genRandomMatrix: (randomConfig) => genRandomMatrix(size, setGrid, randomConfig),
    clearMatrix,
    mutateAt
  };
};

export default useBufferGrid;
