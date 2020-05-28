import React, { useState, useRef, useLayoutEffect } from 'react';

import useDoubleBuffer from './useDoubleBuffer';
import useCellCanvas from './useCellCanvas';
import useGridCanvas from './useGridCanvas';

const GameCanvas = () => {
  const [generation, setGeneration] = useState(0);

  const [cellQuantity] = useState(50);
  const [cellSize, setCellSize] = useState(10);

  const [running, setRunning] = useState(null);

  const [seed, setSeed] = useState('');
  const [density, setDensity] = useState(0.2);

  const containerRef = useRef(null);

  // setup the logic for my buffers and canvases
  const {
    currBuffer,
    mutateCurrent,
    updateNextBuffer,
    genRandomMatrix,
    clearMatrix
  } = useDoubleBuffer(generation, cellQuantity);
  const [cellCanvasRef, mapPixelToCell, toggleRect] = useCellCanvas(currBuffer, cellSize);
  const [gridCanvasRef] = useGridCanvas(cellSize);

  // size the canvases to fit the container div
  useLayoutEffect(() => {
    const { height, width } = containerRef.current.getBoundingClientRect();

    cellCanvasRef.current.height = height;
    cellCanvasRef.current.width = width;

    gridCanvasRef.current.height = height;
    gridCanvasRef.current.width = width;

    setCellSize(width / cellQuantity);
  }, [cellQuantity, containerRef, setCellSize, cellCanvasRef, gridCanvasRef]);

  // All the updates are triggered by this function
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

  // setup an interval for game updates
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
    genRandomMatrix(seed, density);
  };

  const clear = () => {
    stopRunning();
    setGeneration(0);
    clearMatrix();
  };

  return (
    <>
      <div ref={containerRef} className="canvas-container">
        <canvas ref={cellCanvasRef} onClick={handleCanvasClick} className="canvas" />
        <canvas ref={gridCanvasRef} onClick={handleCanvasClick} className="canvas" />
      </div>
      <div className="controls">
        <p>{generation}</p>
        <button
          type="button"
          onClick={clear}
        >
          clear
        </button>
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
      <div>
        <div>
          <label htmlFor="density">
            Density:
            <input name="density" type="text" onChange={(e) => setDensity(e.target.value)} value={density} />
          </label>
        </div>
        <div>
          <label htmlFor="seed">
            Seed:
            <input name="seed" type="text" onChange={(e) => setSeed(e.target.value)} value={seed} />
          </label>
        </div>
      </div>
    </>
  );
};

export default GameCanvas;
