import { useRef, useCallback } from 'react';
import clamp from 'clamp';

import { averageAges, colorByAge, setAlpha } from './util/colorUtil';

const drawCell = (ctx, x, y, cellSize, cell) => {
  ctx.fillStyle = colorByAge(averageAges(cell.age, cell.neighbors));
  ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
};

// iterate over the whole buffer and draw all live cells
const drawCells = (gameBuffer, canvas, cellSize) => {
  const ctx = canvas.getContext('2d');
  gameBuffer.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell) {
        drawCell(ctx, x, y, cellSize, cell);
      }
    });
  });
};

const getRadius = (age, cellSize) => {
  const rad = (cellSize * 6) / (Math.log(Math.max(age, 1)) * 0.3);
  return clamp(rad, cellSize * 3, cellSize * 6);
};

const alphaByAge = (age) => {
  const alpha = 1 / (Math.log(Math.max(age, 1)) * 0.15);
  return clamp(alpha, 0.2, 0.35);
};

const drawGlowCircle = (ctx, x, y, cellSize, cell) => {
  const avgAges = averageAges(cell.age, cell.neighbors);
  const radius = getRadius(avgAges, cellSize);
  const glow = ctx.createRadialGradient(
    (x * cellSize) + (cellSize / 2),
    (y * cellSize) + (cellSize / 2),
    0,
    (x * cellSize) + (cellSize / 2),
    (y * cellSize) + (cellSize / 2),
    radius
  );
  glow.addColorStop(0, setAlpha(colorByAge(Math.min(avgAges, 100)), alphaByAge(avgAges)));
  glow.addColorStop(1, 'transparent');

  ctx.fillStyle = glow;

  const circle = new Path2D();
  circle.arc(
    (x * cellSize) + (cellSize / 2),
    (y * cellSize) + (cellSize / 2),
    radius,
    0,
    Math.PI * 2
  );
  ctx.fill(circle);
};

const drawGlow = (currBuffer, canvas, cellSize) => {
  const ctx = canvas.getContext('2d');
  ctx.globalCompositeOperation = 'screen';

  currBuffer.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell) {
        drawGlowCircle(ctx, x, y, cellSize, cell);
      }
    });
  });
  ctx.globalCompositeOperation = 'source-over';
};

const drawGrid = (canvas, cellSize) => {
  const ctx = canvas.getContext('2d');

  ctx.strokeStyle = 'black';

  // outer border
  ctx.lineWidth = Math.min(cellSize / 4, 2);
  ctx.strokeRect(0, 0, canvas.width, canvas.height);

  // grid lines
  ctx.lineWidth = Math.min(cellSize / 10, 0.5);
  // draw vertical lines, spaced by the cellSize
  ctx.beginPath();
  let currentX = cellSize;
  ctx.moveTo(0, 0);
  ctx.lineTo(0, canvas.height);
  ctx.moveTo(currentX, 0);
  while (currentX <= canvas.width) {
    ctx.lineTo(currentX, canvas.height);
    currentX += cellSize;
    ctx.moveTo(currentX, 0);
  }
  ctx.stroke();

  // draw horizontal lines, spaced by the cellSize
  ctx.beginPath();
  let currentY = cellSize;
  ctx.moveTo(0, 0);
  ctx.lineTo(canvas.width, 0);
  ctx.moveTo(0, currentY);
  while (currentY <= canvas.height) {
    ctx.lineTo(canvas.width, currentY);
    currentY += cellSize;
    ctx.moveTo(0, currentY);
  }
  ctx.stroke();
};


const clearCanvas = (canvas) => {
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
};

const useCellCanvas = (cellSize) => {
  const canvasRef = useRef(null);

  // helper, determines which cell a set of coords is located in (used for clicks)
  const mapPixelToCell = (x, y) => {
    const { top, left } = canvasRef.current.getBoundingClientRect();

    const row = Math.floor((y - top) / cellSize);
    const col = Math.floor((x - left) / cellSize);

    return [row, col];
  };

  const reDraw = useCallback((buffer) => {
    clearCanvas(canvasRef.current);
    drawGlow(buffer, canvasRef.current, cellSize);
    drawCells(buffer, canvasRef.current, cellSize);
    drawGrid(canvasRef.current, cellSize);
  }, [cellSize]);

  return [
    canvasRef,
    mapPixelToCell,
    reDraw
  ];
};

export default useCellCanvas;
