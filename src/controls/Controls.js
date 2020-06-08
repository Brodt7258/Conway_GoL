import React from 'react';
import PropTypes from 'prop-types';
import { Slider } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import { ClearRounded, ShuffleRounded, SkipNextRounded, PlayArrowRounded, PauseRounded } from '@material-ui/icons';

const Controls = ({ data, handlers }) => {
  return (
    <div className="controls">
      <p>{handlers.generation}</p>
      <div>
        <IconButton
          type="button"
          onClick={handlers.clear}
        >
          <ClearRounded />
        </IconButton>
        <IconButton
          type="button"
          onClick={handlers.randomize}
        >
          <ShuffleRounded />
        </IconButton>
        <IconButton
          type="button"
          onClick={handlers.incrementGen}
          disabled={Boolean(data.runningDelay)}
        >
          <SkipNextRounded />
        </IconButton>
        <IconButton
          type="button"
          onClick={handlers.toggleRunning}
        >
          {data.runningDelay ? <PauseRounded /> : <PlayArrowRounded />}
        </IconButton>
      </div>
      <Slider
        defaultValue={30}
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
    seed: PropTypes.string
  }).isRequired
};

export default Controls;
