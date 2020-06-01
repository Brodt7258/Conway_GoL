import { useRef, useEffect } from 'react';

export default (callback, delay) => {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    let id;
    if (delay !== null) {
      id = setInterval(tick, delay);
    }
    return () => clearInterval(id);
  }, [delay]);
};
