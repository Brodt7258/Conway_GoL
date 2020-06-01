import colorInterpolate from 'color-interpolate';
import clamp from 'clamp';

// use neighboring cell ages for calculating cell color (but emphasize this cell's age)
export const averageAges = (age, neighbors) => {
  const avg = (Math.min(age, 300) + neighbors) / 2;
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

export const colorByLiveCount = (liveCount) => {
  const bgMap = colorInterpolate(['#030c21', '#1c0f3e']);
  const scaleCount = Math.min(liveCount / 500, 1.0);
  return bgMap(scaleCount);
};

export const glowByLiveCount = (liveCount) => {
  const glowMap = colorInterpolate(['#BF033B', '#FFC719']);
  const scaleCount = Math.min(liveCount / 400, 1.0);
  return glowMap(scaleCount);
};

export const genBGDivGradient = (containerRef, liveCount) => {
  const { height: containerHeight, width: containerWidth, left, top } = containerRef.current.getBoundingClientRect();
  return `radial-gradient(
    circle at ${left + (containerWidth / 2)}px ${top + (containerHeight / 2)}px,
    ${setAlpha(glowByLiveCount(liveCount),
    clamp(liveCount / 400, 0.2, 0.5))} 0%,
    transparent ${clamp((liveCount / 5), 0, 75)}%)`;
};
