import Position from './position';

const makeRect = ({ width, height }, { left, top }) => {
  return {
    width,
    height,
    left,
    top,
    right: left + width,
    bottom: top + height,
  };
};

const flipHorizontal = position => {
  switch (position) {
    case Position.TOP_LEFT:
      return Position.BOTTOM_LEFT;
    case Position.TOP:
    default:
      return Position.BOTTOM;
    case Position.TOP_RIGHT:
      return Position.BOTTOM_RIGHT;
    case Position.BOTTOM_LEFT:
      return Position.TOP_LEFT;
    case Position.BOTTOM:
      return Position.TOP;
    case Position.BOTTOM_RIGHT:
      return Position.TOP_RIGHT;
  }
};

const isAlignedOnTop = position => {
  switch (position) {
    case Position.TOP_LEFT:
    case Position.TOP:
    case Position.TOP_RIGHT:
      return true;
    default:
      return false;
  }
};

const getFitsOnBottom = (rect, viewport, viewportOffset) => {
  return rect.bottom < viewport.height - viewportOffset;
};

const getFitsOnTop = (rect, viewportOffset) => {
  return rect.top > viewportOffset;
};

const getTransformOrigin = ({ rect, position, targetCenter }) => {
  const center = Math.round(targetCenter - rect.left);
  if (isAlignedOnTop(position)) {
    return `bottom ${center}px`;
  }
  return `top ${center}px`;
};

export default function getFittedPosition({
  position,
  dimensions,
  targetRect,
  targetOffset,
  viewport,
  viewportOffset = 8,
}) {
  const targetCenter = targetRect.left + targetRect.width / 2;

  const { rect, position: finalPosition } = getPosition({
    position,
    dimensions,
    targetRect,
    targetOffset,
    viewport,
    viewportOffset,
  });

  // Push rect to the right if overflowing on the left side of the viewport.
  if (rect.left < viewportOffset) {
    rect.right += Math.ceil(Math.abs(rect.left - viewportOffset));
    rect.left = Math.ceil(viewportOffset);
  }

  // Push rect to the left if overflowing on the right side of the viewport.
  if (rect.right > viewport.width - viewportOffset) {
    const delta = Math.ceil(rect.right - (viewport.width - viewportOffset));
    rect.left -= delta;
    rect.right -= delta;
  }

  const transformOrigin = getTransformOrigin({
    rect,
    position: finalPosition,
    targetCenter,
  });

  return {
    rect,
    position: finalPosition,
    transformOrigin,
  };
}

function getPosition({
  position,
  dimensions,
  targetRect,
  targetOffset,
  viewport,
  viewportOffset = 8,
}) {
  const positionIsAlignedOnTop = isAlignedOnTop(position);
  let topRect;
  let bottomRect;

  if (positionIsAlignedOnTop) {
    topRect = getRect({
      position,
      dimensions,
      targetRect,
      targetOffset,
    });
    bottomRect = getRect({
      position: flipHorizontal(position),
      dimensions,
      targetRect,
      targetOffset,
    });
  } else {
    topRect = getRect({
      position: flipHorizontal(position),
      dimensions,
      targetRect,
      targetOffset,
    });
    bottomRect = getRect({
      position,
      dimensions,
      targetRect,
      targetOffset,
    });
  }

  const topRectFitsOnTop = getFitsOnTop(topRect, viewportOffset);
  const bottomRectFitsOnBottom = getFitsOnBottom(
    bottomRect,
    viewport,
    viewportOffset,
  );

  if (positionIsAlignedOnTop && topRectFitsOnTop) {
    return {
      position,
      rect: topRect,
    };
  }

  if (!positionIsAlignedOnTop) {
    if (bottomRectFitsOnBottom) {
      return {
        position,
        rect: bottomRect,
      };
    } else if (topRectFitsOnTop) {
      return {
        position: flipHorizontal(position),
        rect: topRect,
      };
    }
  }

  // Default to most spacious if there is no fit.
  const spaceBottom = Math.abs(
    viewport.height - viewportOffset - bottomRect.bottom,
  );
  const spaceTop = Math.abs(topRect.top - viewportOffset);

  if (spaceBottom < spaceTop) {
    return {
      position: positionIsAlignedOnTop ? flipHorizontal(position) : position,
      rect: bottomRect,
    };
  }

  return {
    position: positionIsAlignedOnTop ? position : flipHorizontal(position),
    rect: topRect,
  };
}

function getRect({ position, targetOffset, dimensions, targetRect }) {
  const leftRect =
    targetRect.left + targetRect.width / 2 - dimensions.width / 2;
  const alignedTopY = targetRect.top - dimensions.height - targetOffset;
  const alignedBottomY = targetRect.bottom + targetOffset;
  const alignedRightX = targetRect.right - dimensions.width;

  switch (position) {
    case Position.TOP:
      return makeRect(dimensions, {
        left: leftRect,
        top: alignedTopY,
      });
    case Position.TOP_LEFT:
      return makeRect(dimensions, {
        left: targetRect.left,
        top: alignedTopY,
      });
    case Position.TOP_RIGHT:
      return makeRect(dimensions, {
        left: alignedRightX,
        top: alignedTopY,
      });
    default:
    case Position.BOTTOM:
      return makeRect(dimensions, {
        left: leftRect,
        top: alignedBottomY,
      });
    case Position.BOTTOM_LEFT:
      return makeRect(dimensions, {
        left: targetRect.left,
        top: alignedBottomY,
      });
    case Position.BOTTOM_RIGHT:
      return makeRect(dimensions, {
        left: alignedRightX,
        top: alignedBottomY,
      });
  }
}
