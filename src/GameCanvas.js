import React, { useState, useRef, useLayoutEffect, useEffect } from 'react';
import clamp from 'clamp';

import useDoubleBuffer from './useDoubleBuffer';
import useCellCanvas from './useCellCanvas';
import useGridCanvas from './useGridCanvas';
import useBGGlowCanvas from './useBGGlowCanvas';
import { glowByLiveCount, setAlpha } from './colorUtil';

const GameCanvas = () => {
  const [generation, setGeneration] = useState(0);

  const [xQuantity] = useState(50);
  const [yQuantity, setYQuantity] = useState(0);
  const [cellSize, setCellSize] = useState(10);
  const [liveCount, setLiveCount] = useState(0);

  const [running, setRunning] = useState(null);
  const [intervalTime, setIntervalTime] = useState(300);

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
  } = useDoubleBuffer(generation, xQuantity, yQuantity, setLiveCount);
  const [cellCanvasRef, mapPixelToCell, toggleRect] = useCellCanvas(currBuffer, cellSize);
  const [gridCanvasRef] = useGridCanvas(cellSize);
  const [glowRef] = useBGGlowCanvas(currBuffer, cellSize);

  // size the canvases to fit the container div
  const [derivedHeight, setDerivedHeight] = useState(0);
  useLayoutEffect(() => {
    const { height, width } = containerRef.current.getBoundingClientRect();

    cellCanvasRef.current.width = width;
    gridCanvasRef.current.width = width;
    glowRef.current.width = width;

    const derivedCellSize = width / xQuantity;
    const derivedYQuantity = Math.floor(height / derivedCellSize);
    setDerivedHeight(derivedCellSize * derivedYQuantity);

    setCellSize(derivedCellSize);
    setYQuantity(derivedYQuantity);
  }, [xQuantity, containerRef, setCellSize, cellCanvasRef, gridCanvasRef, glowRef]);

  const [gradient, setGradient] = useState('');
  // build a gradient based on liveCount, and positioned behind the canvas container
  useLayoutEffect(() => {
    const { height: containerHeight, width: containerWidth, left, top } = containerRef.current.getBoundingClientRect();

    setGradient(`radial-gradient(
    circle at ${left + (containerWidth / 2)}px ${top + (containerHeight / 2)}px,
    ${setAlpha(glowByLiveCount(liveCount),
    clamp(liveCount / 400, 0.2, 0.5))} 0%,
    transparent ${clamp((liveCount / 5), 0, 75)}%)`);
  }, [liveCount]);

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
      const runInterval = setInterval(incrementGen, intervalTime);
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

  useEffect(() => {
    if (running) {
      stopRunning();
      incrementGen();
      const runInterval = setInterval(incrementGen, intervalTime);
      setRunning(runInterval);
    }
  }, [intervalTime]); // eslint-disable-line react-hooks/exhaustive-deps

  const changeInterval = (increaseSpeed) => {
    if (increaseSpeed) {
      setIntervalTime((prev) => clamp(prev - 50, 50, 2000));
    } else {
      setIntervalTime((prev) => clamp(prev + 50, 50, 2000));
    }
  };

  const speedUp = () => {
    changeInterval(true);
  };

  const slowDown = () => {
    changeInterval(false);
  };

  return (
    <div className="root-container" style={{ backgroundColor: '#030c21', backgroundImage: gradient }}>
      <div ref={containerRef} className="canvas-container">
        <canvas ref={glowRef} height={derivedHeight} onClick={handleCanvasClick} className="canvas index-2" />
        <canvas ref={cellCanvasRef} height={derivedHeight} onClick={handleCanvasClick} className="canvas index-3" />
        <canvas ref={gridCanvasRef} height={derivedHeight} onClick={handleCanvasClick} className="canvas index-4" />
      </div>
      <div className="controls index-2">
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
        <button
          type="button"
          onClick={slowDown}
        >
          -
        </button>
        <span>{intervalTime}</span>
        <button
          type="button"
          onClick={speedUp}
        >
          +
        </button>
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
      </div>
    </div>
  );
};

export default GameCanvas;
