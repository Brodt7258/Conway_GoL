import { useRef, useEffect } from 'react';
import { averageAges, colorByAge } from './colorUtil';

// iterate over the whole buffer and draw all live cells
const drawState = (gameBuffer, canvas, cellSize) => {
  const ctx = canvas.getContext('2d');

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  gameBuffer.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell) {
        ctx.fillStyle = colorByAge(averageAges(cell.age, cell.neighbors));
        ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
      }
    });
  });
};

// draw/clear 1 cell (such as for clicks)
const toggleRect = (canvas, cellSize, cell, x, y) => {
  const ctx = canvas.getContext('2d');
  console.log('cell', cell);
  if (!cell) {
    ctx.fillStyle = '#FFC719';
    ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
  } else {
    ctx.clearRect(x * cellSize, y * cellSize, cellSize, cellSize);
  }
};

const useCellCanvas = (currBuffer, cellSize) => {
  const canvasRef = useRef(null);

  // any time the buffer is switched, automatically redraw the canvas with new state
  useEffect(() => {
    drawState(currBuffer, canvasRef.current, cellSize);
  }, [currBuffer, cellSize]);

  // helper, determines which cell a set of coords is located in (used for clicks)
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
