import React from 'react';
import { Typography } from '@material-ui/core';
import Proptypes from 'prop-types';

const CounterDisplay = ({ live, gen }) => {
  return (
    <div className="counter-display">
      <Typography
        variant="h5"
        className="light"
      >
        {`Live: ${live}`}
      </Typography>
      <Typography
        variant="h5"
        className="light"
      >
        {`Gen: ${gen}`}
      </Typography>
    </div>
  );
};

CounterDisplay.propTypes = {
  live: Proptypes.number.isRequired,
  gen: Proptypes.number.isRequired
};

export default CounterDisplay;
