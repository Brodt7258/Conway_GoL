import { useRef, useEffect } from 'react';

const drawGrid = (grid, cellSize) => {
  const ctx = grid.getContext('2d');
  ctx.clearRect(0, 0, grid.width, grid.height);

  ctx.strokeStyle = 'black';
  ctx.lineWidth = Math.min(cellSize / 4, 2);
  ctx.strokeRect(0, 0, grid.width, grid.height);
  ctx.lineWidth = Math.min(cellSize / 10, 0.5);

  // draw vertical lines, spaced by the cellSize
  ctx.beginPath();
  let currentX = cellSize;
  ctx.moveTo(0, 0);
  ctx.lineTo(0, grid.height);
  ctx.moveTo(currentX, 0);
  while (currentX <= grid.width) {
    ctx.lineTo(currentX, grid.height);
    currentX += cellSize;
    ctx.moveTo(currentX, 0);
  }
  ctx.stroke();

  // draw horizontal lines, spaced by the cellSize
  ctx.beginPath();
  let currentY = cellSize;
  ctx.moveTo(0, 0);
  ctx.lineTo(grid.width, 0);
  ctx.moveTo(0, currentY);
  while (currentY <= grid.height) {
    ctx.lineTo(grid.width, currentY);
    currentY += cellSize;
    ctx.moveTo(0, currentY);
  }
  ctx.stroke();
};

const useGridCanvas = (cellSize) => {
  const gridCanvasRef = useRef(null);

  // redraw the grid any time the cellSize argument changes
  useEffect(() => {
    drawGrid(gridCanvasRef.current, cellSize);
  }, [cellSize]);

  return [gridCanvasRef];
};

export default useGridCanvas;
