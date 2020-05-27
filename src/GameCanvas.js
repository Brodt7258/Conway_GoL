import React, { useRef, useEffect, useState, useLayoutEffect, useCallback } from 'react';

import useBufferGrid from './useBufferGrid';

const GameCanvas = () => {
  const [generation, setGeneration] = useState(0);

  const [cellSize, setCellSize] = useState(0);
  const [cellQuantity] = useState(20);

  const bufferA = useBufferGrid(cellQuantity);
  const bufferB = useBufferGrid(cellQuantity);

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
    drawState(canvasRef.current, onBuffer().grid, cellSize);
  }, [cellSize, onBuffer]);

  useEffect(() => {
    offBuffer().computeNext(onBuffer().grid);
  }, [generation, onBuffer, offBuffer]);

  const incrementGen = () => {
    const nextGen = generation + 1;
    setGeneration(nextGen);
  };

  const handleCanvasClick = (e) => {
    const { top, left } = canvasRef.current.getBoundingClientRect();

    const row = Math.floor((e.clientY - top) / cellSize);
    const col = Math.floor((e.clientX - left) / cellSize);

    onBuffer().grid[row][col] = !onBuffer().grid[row][col];
    drawState(canvasRef.current, onBuffer().grid, cellSize);
    offBuffer().computeNext(onBuffer().grid);
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
