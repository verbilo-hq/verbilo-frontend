export const ORG_MAP_CLICK_TOLERANCE = 6;

export function nextPanPosition({ startPointer, currentPointer, originPan }) {
  return {
    x: originPan.x + currentPointer.x - startPointer.x,
    y: originPan.y + currentPointer.y - startPointer.y,
  };
}

export function didPanPastClickTolerance({
  startPointer,
  currentPointer,
  tolerance = ORG_MAP_CLICK_TOLERANCE,
}) {
  const distanceX = currentPointer.x - startPointer.x;
  const distanceY = currentPointer.y - startPointer.y;
  return Math.hypot(distanceX, distanceY) > tolerance;
}
