import { useCallback, useEffect } from 'react';
import useBufferGrid from './useBufferGrid';

const useDoubleBuffer = (generation, cellQuantity, randomConfig) => {
  const bufferA = useBufferGrid(cellQuantity);
  const bufferB = useBufferGrid(cellQuantity);

  // the generation argument is used to determine which buffer is being used
  const current = useCallback(() => {
    return generation % 2 === 0 ? bufferA : bufferB;
  }, [generation, bufferA, bufferB]);

  const next = useCallback(() => {
    return generation % 2 === 1 ? bufferA : bufferB;
  }, [generation, bufferA, bufferB]);

  // any time the callbacks update (on generation change), write the next state to the unused buffer
  useEffect(() => {
    next().computeNext(current().grid);
  }, [current, next]);

  // build obj of helper properties to read and write state outside of this hook
  const buffers = {
    get currBuffer() {
      return current().grid;
    },
    get nextBuffer() {
      return next().grid;
    },
    updateNextBuffer() {
      next().computeNext(current().grid);
    },
    mutateCurrent(row, col) {
      if (current().grid[row][col] === false) {
        current().grid[row][col] = true;
      } else {
        current().grid[row][col] = false;
      }
    },
    genRandomMatrix() {
      bufferA.genRandomMatrix(randomConfig);
    },
    clearMatrix() {
      bufferA.clearMatrix();
    }
  };

  return buffers;
};

export default useDoubleBuffer;
