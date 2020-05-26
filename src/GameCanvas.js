import React, { useRef, useEffect, useState } from 'react';

const bufferA = [
  [true, false, false, false, false],
  [false, true, true, false, false],
  [true, true, false, false, false],
  [false, false, false, false, false],
  [false, false, false, false, false]
];

const bufferB = [
  [false, false, false, false, false],
  [false, false, false, false, false],
  [false, false, false, false, false],
  [false, false, false, false, false],
  [false, false, false, false, false]
];

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
  // console.log('prev', prev);
  // console.log('next', next);
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

// const buffers = [bufferA, bufferB];

const cellSize = 40;

const GameCanvas = () => {
  const [currBuffer, setCurrBuffer] = useState(bufferA);
  const [generation, setGeneration] = useState(0);

  const canvasRef = useRef(null);
  useEffect(() => {
    drawState(canvasRef.current, currBuffer);
  }, [currBuffer]);

  useEffect(() => {
    if (generation % 2 === 0) {
      console.log('a => b');
      computeNextState(bufferA, bufferB);
    } else {
      console.log('b => a');
      computeNextState(bufferB, bufferA);
    }
  }, [generation]);

  const incrementGen = () => {
    const nextGen = generation + 1;
    setGeneration(nextGen);
    setCurrBuffer(nextGen % 2 ? bufferB : bufferA);
  };

  const handleCanvasClick = (e) => {
    const { top, left } = canvasRef.current.getBoundingClientRect();

    const row = Math.floor((e.clientY - top) / cellSize);
    const col = Math.floor((e.clientX - left) / cellSize);

    currBuffer[row][col] = !currBuffer[row][col];
    drawState(canvasRef.current, currBuffer);
    computeNextState(currBuffer, generation % 2 === 0 ? bufferB : bufferA);
  };

  return (
    <>
      <canvas ref={canvasRef} width={200} height={200} onClick={handleCanvasClick} />
      <div>
        <p>{generation}</p>
        <button type="button" onClick={incrementGen}>step</button>
      </div>
    </>
  );
};

const drawState = (canvas, gameBuffer) => {
  const ctx = canvas.getContext('2d');

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'orange';
  gameBuffer.forEach((row, i) => {
    row.forEach((e, j) => {
      if (e) {
        ctx.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);
      }
    });
  });
};

export default GameCanvas;
