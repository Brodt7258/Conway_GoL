import React, { useEffect, useState } from 'react';

import useDoubleBuffer from './useDoubleBuffer';
import useCanvas from './useCanvas';

const GameCanvas = () => {
  const [generation, setGeneration] = useState(0);
  const [cellQuantity] = useState(20);
  const [running, setRunning] = useState(null);

  const { currBuffer, updateNextBuffer } = useDoubleBuffer(generation, cellQuantity);
  const [canvasRef, containerRef, drawState, mapPixelToCell] = useCanvas(cellQuantity);

  useEffect(() => {
    drawState(currBuffer.grid);
  }, [drawState, currBuffer]);

  const incrementGen = () => {
    setGeneration((prev) => prev + 1);
  };

  const handleCanvasClick = (e) => {
    const [row, col] = mapPixelToCell(e.clientX, e.clientY);
    currBuffer.grid[row][col] = !currBuffer.grid[row][col];
    drawState(currBuffer.grid);
    updateNextBuffer();
  };

  const toggleRunning = () => {
    if (running) {
      clearInterval(running);
      setRunning(null);
    } else {
      const runInterval = setInterval(incrementGen, 500);
      setRunning(runInterval);
    }
  };

  return (
    <>
      <div ref={containerRef} className="canvas-container">
        <canvas ref={canvasRef} onClick={handleCanvasClick} className="canvas" />
      </div>
      <div className="controls">
        <p>{generation}</p>
        <button type="button" onClick={incrementGen}>step</button>
        <button type="button" onClick={toggleRunning}>{running ? 'pause' : 'play'}</button>
      </div>
    </>
  );
};

export default GameCanvas;
