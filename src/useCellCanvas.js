import { useRef, useEffect } from 'react';

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

const useCellCanvas = (currBuffer, cellSize) => {
  const canvasRef = useRef(null);

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
    mapPixelToCell,
    (cell, x, y) => toggleRect(canvasRef.current, cellSize, cell, x, y)
  ];
};

export default useCellCanvas;
