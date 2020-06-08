import React from 'react';
import PropTypes from 'prop-types';

const Settings = ({ data, handlers }) => {
  return (
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
  );
};

Settings.propTypes = {
  handlers: PropTypes.objectOf(PropTypes.func).isRequired,
  data: PropTypes.shape({
    density: PropTypes.number,
    seed: PropTypes.string
  }).isRequired
};

export default Settings;
