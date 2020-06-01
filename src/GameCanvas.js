import React, { useState, useRef, useLayoutEffect, useEffect } from 'react';
import clamp from 'clamp';

import useCellCanvas from './useCellCanvas';
import { genBGDivGradient } from './util/colorUtil';
import useInterval from './util/useInterval';
import deriveDimensions from './util/deriveDimensions';
import {
  initBuffers,
  advanceGameState,
  getCurrentBuffer,
  initRandom,
  mutateAt
} from './state/buffers';

const GameCanvas = () => {
  const [generation, setGeneration] = useState(0);
  const [liveCount, setLiveCount] = useState(0);

  const containerRef = useRef(null);

  const [{ xQuantity, yQuantity, cellSize, derivedHeight }, setLayout] = useState({ xQuantity: 50 });
  const [cellCanvasRef, mapPixelToCell, reDraw] = useCellCanvas(cellSize);
  useLayoutEffect(() => {
    const { height, width } = containerRef.current.getBoundingClientRect();
    cellCanvasRef.current.width = width;
    const [derivedCellSize, derivedYQuantity, canvasHeight] = deriveDimensions(xQuantity, height, width);
    setLayout((prev) => ({ ...prev, yQuantity: derivedYQuantity, cellSize: derivedCellSize, derivedHeight: canvasHeight }));
  }, [xQuantity, containerRef, cellCanvasRef]);

  useEffect(() => {
    initBuffers(yQuantity, xQuantity);
  }, [xQuantity, yQuantity]);

  useEffect(() => {
    const count = advanceGameState();
    setLiveCount(count);
    reDraw(getCurrentBuffer());
  }, [generation, reDraw]);

  const [gradient, setGradient] = useState('');
  useLayoutEffect(() => {
    setGradient(genBGDivGradient(containerRef, liveCount));
  }, [liveCount]);

  // All the updates are triggered by this function
  const incrementGen = () => {
    setGeneration((prev) => prev + 1);
  };

  const [selectedDelay, setSelectedDelay] = useState(150);
  const [runningDelay, setRunningDelay] = useState(null);
  useInterval(incrementGen, runningDelay);

  const handleCanvasClick = (e) => {
    const [row, col] = mapPixelToCell(e.clientX, e.clientY);
    mutateAt(row, col);
    reDraw(getCurrentBuffer());
  };

  const stopRunning = () => {
    setRunningDelay(null);
  };

  // setup an interval for game updates
  const toggleRunning = () => {
    if (runningDelay) {
      stopRunning();
    } else {
      setRunningDelay(selectedDelay);
    }
  };

  const [seed, setSeed] = useState('');
  const [density, setDensity] = useState(0.2);
  const randomize = () => {
    stopRunning();
    setGeneration(0);
    const count = initRandom(yQuantity, xQuantity, density, seed);
    setLiveCount(count);
    reDraw(getCurrentBuffer());
  };

  const clear = () => {
    stopRunning();
    setGeneration(0);
    initBuffers(yQuantity, xQuantity);
    reDraw(getCurrentBuffer());
  };

  const changeSpeed = (faster) => {
    const newDelay = clamp(selectedDelay + (faster ? -50 : 50), 50, 2000);
    setSelectedDelay(newDelay);
    if (runningDelay) {
      setRunningDelay(newDelay);
    }
  };

  return (
    <div className="root-container" style={{ backgroundColor: '#030c21', backgroundImage: gradient }}>
      <div ref={containerRef} className="canvas-container">
        <canvas
          ref={cellCanvasRef}
          height={derivedHeight}
          onClick={handleCanvasClick}
          className="canvas"
        />
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
          disabled={runningDelay}
        >
          step
        </button>
        <button
          type="button"
          onClick={toggleRunning}
        >
          {runningDelay ? 'pause' : 'play'}
        </button>
        <button
          type="button"
          onClick={() => changeSpeed(false)}
        >
          -
        </button>
        <span>{selectedDelay}</span>
        <button
          type="button"
          onClick={() => changeSpeed(true)}
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
