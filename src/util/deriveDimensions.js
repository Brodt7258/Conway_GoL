export default (quantity, height, width) => {
  const derivedCellSize = width / quantity;
  const derivedYQuantity = Math.floor(height / derivedCellSize);
  const derivedHeight = derivedCellSize * derivedYQuantity;
  return [derivedCellSize, derivedYQuantity, derivedHeight];
};
