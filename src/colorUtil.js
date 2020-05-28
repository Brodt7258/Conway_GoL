import colorInterpolate from 'color-interpolate';

// use neighboring cell ages for calculating cell color (but emphasize this cell's age)
export const averageAges = (age, neighbors) => {
  const avg = neighbors.reduce((acc, e) => acc + e, age * 2) / (neighbors.length + 2);
  return avg;
};

// map an age integer to a color between two (or more) values. Like a gradient.
export const colorByAge = (age) => {
  const brightMap = colorInterpolate(['#FFC719', '#BF033B']);
  const darkMap = colorInterpolate(['#BF033B', '#4c0117']);

  return age <= 100 ? brightMap(age / 100) : darkMap(Math.min((age - 100) / 100, 1));
};

export const setAlpha = (color, alpha) => {
  return [color.slice(0, 3), 'a', color.slice(3, -1), `, ${alpha}`, color.slice(-1)].join('');
};