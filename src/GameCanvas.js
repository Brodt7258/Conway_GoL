import React, { useRef, useEffect, useState, useLayoutEffect, useCallback } from 'react';

import useBufferGrid from './useBufferGrid';

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

const GameCanvas = () => {
  const [generation, setGeneration] = useState(0);

  const [cellSize, setCellSize] = useState(0);
  const [cellQuantity] = useState(20);

  const { grid: bufferA } = useBufferGrid(cellQuantity);
  const { grid: bufferB } = useBufferGrid(cellQuantity);

  const onBuffer = useCallback(() => {
    return generation % 2 === 0 ? bufferA : bufferB;
  }, [generation, bufferA, bufferB]);

  const offBuffer = useCallback(() => {
    return generation % 2 === 1 ? bufferA : bufferB;
  }, [generation, bufferA, bufferB]);

  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  useLayoutEffect(() => {
    const { height, width } = containerRef.current.getBoundingClientRect();
    canvasRef.current.height = height;
    canvasRef.current.width = width;
    setCellSize(width / cellQuantity);
  }, [cellQuantity]);

  useEffect(() => {
    drawState(canvasRef.current, onBuffer(), cellSize);
  }, [cellSize, onBuffer]);

  useEffect(() => {
    computeNextState(onBuffer(), offBuffer());
  }, [generation, onBuffer, offBuffer]);

  const incrementGen = () => {
    const nextGen = generation + 1;
    setGeneration(nextGen);
  };

  const handleCanvasClick = (e) => {
    const { top, left } = canvasRef.current.getBoundingClientRect();

    const row = Math.floor((e.clientY - top) / cellSize);
    const col = Math.floor((e.clientX - left) / cellSize);

    onBuffer()[row][col] = !onBuffer()[row][col];
    drawState(canvasRef.current, onBuffer(), cellSize);
    computeNextState(onBuffer(), offBuffer());
  };

  return (
    <>
      <div ref={containerRef} className="canvas-container">
        <canvas ref={canvasRef} width={200} height={200} onClick={handleCanvasClick} className="canvas" />
      </div>
      <div className="controls">
        <p>{generation}</p>
        <button type="button" onClick={incrementGen}>step</button>
      </div>
    </>
  );
};

const drawState = (canvas, gameBuffer, cellSize) => {
  const ctx = canvas.getContext('2d');

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'orange';
  gameBuffer.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell) {
        ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
      }
    });
  });
};

export default GameCanvas;
