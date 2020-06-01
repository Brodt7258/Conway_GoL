import React from 'react';
import PropTypes from 'prop-types';

const Controls = ({ data, handlers }) => {
  return (
    <div className="controls">
      <p>{handlers.generation}</p>
      <button
        type="button"
        onClick={handlers.clear}
      >
        clear
      </button>
      <button
        type="button"
        onClick={handlers.randomize}
      >
        randomize
      </button>
      <button
        type="button"
        onClick={handlers.incrementGen}
        disabled={data.runningDelay}
      >
        step
      </button>
      <button
        type="button"
        onClick={handlers.toggleRunning}
      >
        {data.runningDelay ? 'pause' : 'play'}
      </button>
      <button
        type="button"
        onClick={() => handlers.changeSpeed(false)}
      >
        -
      </button>
      <span>{data.selectedDelay}</span>
      <button
        type="button"
        onClick={() => handlers.changeSpeed(true)}
      >
        +
      </button>
      <div>
        <div>
          <label htmlFor="density">
            Density:
            <input
              name="density"
              type="text"
              onChange={(e) => handlers.setDensity(e.target.value)}
              value={data.density}
            />
          </label>
        </div>
        <div>
          <label htmlFor="seed">
            Seed:
            <input
              name="seed"
              type="text"
              onChange={(e) => handlers.setSeed(e.target.value)}
              value={data.seed}
            />
          </label>
        </div>
      </div>
    </div>
  );
};

Controls.propTypes = {
  handlers: PropTypes.objectOf(PropTypes.func).isRequired,
  data: PropTypes.shape({
    generation: PropTypes.number,
    runningDelay: PropTypes.number,
    selectedDelay: PropTypes.number,
    density: PropTypes.number,
    seed: PropTypes.string
  }).isRequired
};

export default Controls;
