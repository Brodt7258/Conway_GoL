import React, { useState } from 'react';

import useDoubleBuffer from './useDoubleBuffer';
import useCanvas from './useCanvas';

const GameCanvas = () => {
  const [generation, setGeneration] = useState(0);
  const [cellQuantity] = useState(20);
  const [running, setRunning] = useState(null);

  // const [seed, setSeed] = useState('');
  // const [density, setDensity] = useState(0.2);

  const { currBuffer, mutateCurrent, updateNextBuffer, genRandomMatrix } = useDoubleBuffer(generation, cellQuantity);
  const [canvasRef, containerRef, mapPixelToCell, toggleRect] = useCanvas(currBuffer, cellQuantity);

  const incrementGen = () => {
    setGeneration((prev) => prev + 1);
  };

  const handleCanvasClick = (e) => {
    const [row, col] = mapPixelToCell(e.clientX, e.clientY);
    const cell = currBuffer[row][col];
    mutateCurrent(row, col);
    toggleRect(cell, col, row);
    updateNextBuffer();
  };

  const stopRunning = () => {
    clearInterval(running);
    setRunning(null);
  };

  const toggleRunning = () => {
    if (running) {
      stopRunning();
    } else {
      const runInterval = setInterval(incrementGen, 50);
      setRunning(runInterval);
    }
  };

  const randomize = () => {
    stopRunning();
    setGeneration(0);
    genRandomMatrix();
  };

  return (
    <>
      <div ref={containerRef} className="canvas-container">
        <canvas ref={canvasRef} onClick={handleCanvasClick} className="canvas" />
      </div>
      <div className="controls">
        <p>{generation}</p>
        <button
          type="button"
          onClick={randomize}
        >
          randomize
        </button>
        <button
          type="button"
          onClick={incrementGen}
          disabled={running}
        >
          step
        </button>
        <button
          type="button"
          onClick={toggleRunning}
        >
          {running ? 'pause' : 'play'}
        </button>
      </div>
    </>
  );
};

export default GameCanvas;
