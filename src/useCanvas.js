import { useState, useRef, useLayoutEffect } from 'react';

const useCanvas = (cellQuantity) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  const [cellSize, setCellSize] = useState(0);

  useLayoutEffect(() => {
    const { height, width } = containerRef.current.getBoundingClientRect();
    canvasRef.current.height = height;
    canvasRef.current.width = width;
    setCellSize(width / cellQuantity);
  }, [cellQuantity]);

  const drawState = (gameBuffer) => {
    const canvas = canvasRef.current;
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

  const mapPixelToCell = (x, y) => {
    const { top, left } = canvasRef.current.getBoundingClientRect();

    const row = Math.floor((y - top) / cellSize);
    const col = Math.floor((x - left) / cellSize);

    return [row, col];
  };

  return [canvasRef, containerRef, drawState, mapPixelToCell];
};

export default useCanvas;
