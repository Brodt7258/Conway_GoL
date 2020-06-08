import React from 'react';
import PropTypes from 'prop-types';
import { Slider, Button, ButtonGroup } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faRandom,
  faTimes,
  faStepForward,
  faPlay,
  faPause,
  faCog,
  faPlus,
  faMinus
} from '@fortawesome/free-solid-svg-icons';

import CounterDisplay from './CounterDisplay';

const Controls = ({ data, handlers }) => {
  return (
    <div className="controls">
      <CounterDisplay
        live={data.liveCount}
        gen={data.generation}
      />
      <ButtonGroup
        className="button-controls"
        variant="contained"
        fullWidth
      >
        <Button
          className="btn-ctrl"
          type="button"
          onClick={handlers.clear}
        >
          <FontAwesomeIcon icon={faTimes} />
        </Button>
        <Button
          className="btn-ctrl"
        >
          <FontAwesomeIcon icon={faCog} />
        </Button>
        <Button
          className="btn-ctrl"
          type="button"
          onClick={handlers.randomize}
        >
          <FontAwesomeIcon icon={faRandom} />
        </Button>
        <Button
          className="btn-ctrl"
          type="button"
          onClick={handlers.toggleRunning}
        >
          {data.runningDelay ? <FontAwesomeIcon icon={faPause} /> : <FontAwesomeIcon icon={faPlay} />}
        </Button>
        <Button
          className="btn-ctrl"
          type="button"
          onClick={handlers.incrementGen}
        >
          <FontAwesomeIcon icon={faStepForward} />
        </Button>
      </ButtonGroup>
      <div className="slider-grp">
        <FontAwesomeIcon
          onClick={() => handlers.changeSpeed(1)}
          icon={faMinus}
          className="light"
        />
        <Slider
          defaultValue={10}
          getAriaValueText={() => data.selectedSpeed}
          aria-labelledby="discrete-slider"
          valueLabelDisplay="auto"
          step={1}
          marks
          min={1}
          max={20}
          value={data.selectedSpeed}
          onChange={(_, val) => handlers.changeSpeed(val)}
        />
        <FontAwesomeIcon
          onClick={() => handlers.changeSpeed(20)}
          icon={faPlus}
          className="light"
        />
      </div>
    </div>
  );
};

Controls.propTypes = {
  handlers: PropTypes.objectOf(PropTypes.func).isRequired,
  data: PropTypes.shape({
    generation: PropTypes.number,
    runningDelay: PropTypes.number,
    selectedSpeed: PropTypes.number,
    density: PropTypes.number,
    seed: PropTypes.string,
    liveCount: PropTypes.number
  }).isRequired
};

export default Controls;
