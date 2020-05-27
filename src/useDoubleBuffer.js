import { useCallback, useEffect } from 'react';
import useBufferGrid from './useBufferGrid';

const useDoubleBuffer = (generation, cellQuantity) => {
  const bufferA = useBufferGrid(cellQuantity);
  const bufferB = useBufferGrid(cellQuantity);

  const current = useCallback(() => {
    return generation % 2 === 0 ? bufferA : bufferB;
  }, [generation, bufferA, bufferB]);

  const next = useCallback(() => {
    return generation % 2 === 1 ? bufferA : bufferB;
  }, [generation, bufferA, bufferB]);

  useEffect(() => {
    next().computeNext(current().grid);
  }, [current, next]);

  const buffers = {
    get currBuffer() {
      return current();
    },
    get nextBuffer() {
      return next();
    },
    updateNextBuffer() {
      next().computeNext(current().grid);
    }
  };

  return buffers;
};

export default useDoubleBuffer;
