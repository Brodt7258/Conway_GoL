import { useRef, useEffect } from 'react';
import clamp from 'clamp';

import { averageAges, colorByAge, setAlpha } from './colorUtil';

const getRadius = (age, cellSize) => {
  const rad = (cellSize * 6) / (Math.log(Math.max(age, 1)) * 0.3);
  return clamp(rad, cellSize * 3, cellSize * 6);
};

const alphaByAge = (age) => {
  const alpha = Math.log(Math.min(age, 1));
  return clamp(alpha, 0.2, 1);
};

const drawGlow = (currBuffer, canvas, cellSize) => {
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.globalCompositeOperation = 'screen';

  currBuffer.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell) {
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
      }
    });
  });
};

const useBGGlowCanvas = (currBuffer, cellSize) => {
  const glowRef = useRef(null);

  useEffect(() => {
    drawGlow(currBuffer, glowRef.current, cellSize);
  }, [currBuffer, cellSize]);

  return [glowRef];
};

export default useBGGlowCanvas;
