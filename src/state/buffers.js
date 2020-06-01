import SeedRandom from 'seedrandom';

let bufferA = null;
let bufferB = null;

let flip = true;

export const getCurrentBuffer = () => {
  return flip ? bufferA : bufferB;
};

export const getNextBuffer = () => {
  return flip ? bufferB : bufferA;
};

export const initBuffers = (rows, cols) => {
  bufferA = matrixOfSize(rows, cols);
  bufferB = matrixOfSize(rows, cols);
  flip = true;
};

const matrixOfSize = (rows, cols) => {
  return [...Array(rows)].map(() => Array(cols).fill(null));
};

export const initRandom = (rows, cols, density = 0.2, seed = '') => {
  const [randMatrix, count] = genRandomMatrix(rows, cols, density, seed);
  bufferA = randMatrix;
  bufferB = matrixOfSize(rows, cols);
  flip = true;
  return count;
};

const genRandomMatrix = (rows, cols, density = 0.2, seed = '') => {
  const random = seed ? new SeedRandom(seed) : new SeedRandom();
  let count = 0;
  const randMatrix = [...Array(rows)].map(() => [...Array(cols)].map(() => {
    const isLive = random() < density;
    if (isLive) {
      count += 1;
      return newCell();
    }
    return null;
  }));
  return [randMatrix, count];
};

export const advanceGameState = () => {
  return computeNextState(getCurrentBuffer(), getNextBuffer());
};

export const computeNextState = (prev, next) => {
  let count = 0;
  next.forEach((row, i) => {
    row.forEach((_, j) => {
      const [neighbors, ages] = totalNeighbors(j, i, prev);
      if (prev[i][j] && (neighbors < 2 || neighbors > 3)) {
        next[i][j] = null;
      } else if (!prev[i][j] && neighbors === 3) {
        count += 1;
        next[i][j] = newCell({ age: 0, neighbors: ages / neighbors });
      } else if (prev[i][j]) {
        count += 1;
        next[i][j] = { ...prev[i][j], age: prev[i][j].age + 1, neighbors: ages / neighbors };
      } else {
        next[i][j] = null;
      }
    });
  });
  flip = !flip;
  return [next, count];
};

const totalNeighbors = (x, y, prev) => {
  const neighborOffsets = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
  const total = neighborOffsets.reduce((acc, offset) => {
    const neighbor = getOffsetNeighbor(offset, x, y, prev);
    if (neighbor) {
      acc[0] += 1;
      acc[1] += neighbor.age;
    }
    return acc;
  }, [0, 0]);
  return total;
};

const getOffsetNeighbor = (offset, x, y, prev) => {
  // ((n % m) + m) % m;
  const yPos = (((offset[0] + y) % prev.length) + prev.length) % prev.length;
  const xPos = (((offset[1] + x) % prev[0].length) + prev[0].length) % prev[0].length;
  return prev[yPos][xPos];
};

const newCell = (config = { age: 0, neighbors: 0 }) => {
  return { age: config.age, neighbors: config.neighbors };
};

export const mutateAt = (row, col) => {
  if (getCurrentBuffer()[row][col]) {
    getCurrentBuffer()[row][col] = null;
  } else {
    getCurrentBuffer()[row][col] = newCell();
  }
};
