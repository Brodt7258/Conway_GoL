import { useState, useRef, useLayoutEffect, useEffect } from 'react';

const drawState = (gameBuffer, canvas, cellSize) => {
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

const toggleRect = (canvas, cellSize, cell, x, y) => {
  const ctx = canvas.getContext('2d');
  console.log('cell', cell);
  if (!cell) {
    ctx.fillStyle = 'orange';
    ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
  } else {
    ctx.clearRect(x * cellSize, y * cellSize, cellSize, cellSize);
  }
};

const useCanvas = (currBuffer, cellQuantity) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  const [cellSize, setCellSize] = useState(0);

  useLayoutEffect(() => {
    const { height, width } = containerRef.current.getBoundingClientRect();
    canvasRef.current.height = height;
    canvasRef.current.width = width;
    setCellSize(width / cellQuantity);
  }, [cellQuantity]);

  useEffect(() => {
    drawState(currBuffer, canvasRef.current, cellSize);
  }, [currBuffer, cellSize]);

  const mapPixelToCell = (x, y) => {
    const { top, left } = canvasRef.current.getBoundingClientRect();

    const row = Math.floor((y - top) / cellSize);
    const col = Math.floor((x - left) / cellSize);

    return [row, col];
  };

  return [
    canvasRef,
    containerRef,
    mapPixelToCell,
    (cell, x, y) => toggleRect(canvasRef.current, cellSize, cell, x, y)
  ];
};

export default useCanvas;
