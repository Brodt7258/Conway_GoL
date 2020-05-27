import { useState, useEffect } from 'react';

const matrixOfSize = (size) => {
  return [...Array(size)].map(() => Array(size).fill(false));
};

const useBufferGrid = (size) => {
  const [grid, setGrid] = useState(matrixOfSize(size));

  useEffect(() => {
    setGrid(matrixOfSize(size));
  }, [size]);

  return { grid };
};

export default useBufferGrid;
