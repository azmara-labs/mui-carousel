import { AnimatePresence, type MotionProps, motion, type PanInfo } from "framer-motion";
import { type ReactNode, useEffect, useRef } from "react";
import { StyledItem } from "./Styled.js";

// Animation variants - extracted as constants to prevent recreation on every render
const SLIDE_VARIANTS = {
  leftwardExit: {
    x: "-100%",
    opacity: 1,
    zIndex: 0,
  },
  leftOut: {
    x: "-100%",
    opacity: 1,
    display: "none",
    zIndex: 0,
  },
  rightwardExit: {
    x: "100%",
    opacity: 1,
    zIndex: 0,
  },
  rightOut: {
    x: "100%",
    opacity: 1,
    display: "none",
    zIndex: 0,
  },
  center: {
    x: 0,
    opacity: 1,
    zIndex: 1,
  },
} as const;

const FADE_VARIANTS = {
  leftwardExit: {
    x: 0,
    opacity: 0,
    zIndex: 0,
  },
  leftOut: {
    x: 0,
    opacity: 0,
    display: "none",
    zIndex: 0,
  },
  rightwardExit: {
    x: 0,
    opacity: 0,
    zIndex: 0,
  },
  rightOut: {
    x: 0,
    opacity: 0,
    display: "none",
    zIndex: 0,
  },
  center: {
    x: 0,
    opacity: 1,
    zIndex: 1,
  },
} as const;

export interface CarouselItemProps {
  animation: "fade" | "slide";
  next?: (event: any) => void;
  prev?: (event: any) => void;
  state: {
    active: number;
    prevActive: number;
    next: boolean;
  };
  swipe?: boolean;
  index: number;
  maxIndex: number;
  duration: number;
  child: ReactNode;
  height?: number | string;
  setHeight: (height: number) => void;
}

export const CarouselItem = ({
  animation,
  next,
  prev,
  swipe,
  state,
  index,
  maxIndex,
  duration,
  child,
  height,
  setHeight,
}: CarouselItemProps) => {
  const slide = animation === "slide";

  const dragProps: MotionProps = {
    drag: "x",
    layout: true,
    onDragEnd: (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo): void => {
      if (!swipe) return;

      if (info.offset.x > 0) prev?.(event);
      else if (info.offset.x < 0) next?.(event);

      event.stopPropagation();
    },
    dragElastic: 0,
    dragConstraints: { left: 0, right: 0 },
  };

  const divRef = useRef<any>(null);

  // Use ResizeObserver for efficient height tracking
  useEffect(() => {
    if (index !== state.active || !divRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const height = entry.contentRect.height;
        if (height > 0) {
          setHeight(height);
        }
      }
    });

    resizeObserver.observe(divRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [index, state.active, setHeight]);

  // Select variant set based on animation type
  const variants = slide ? SLIDE_VARIANTS : FADE_VARIANTS;

  // Handle animation directions and opacity given based on active, prevActive and this item's index
  const { active, next: isNext, prevActive } = state;
  let animate: string;
  if (index === active) animate = "center";
  else if (index === prevActive) {
    animate = isNext ? "leftwardExit" : "rightwardExit";
    if (active === maxIndex && index === 0) animate = "rightwardExit";
    if (active === 0 && index === maxIndex) animate = "leftwardExit";
  } else {
    animate = index < active ? "leftOut" : "rightOut";
    if (active === maxIndex && index === 0) animate = "rightOut";
    if (active === 0 && index === maxIndex) animate = "leftOut";
  }

  duration = duration / 1000;

  return (
    <StyledItem>
      <AnimatePresence custom={isNext}>
        <motion.div {...(swipe && dragProps)} style={{ height: "100%" }}>
          <motion.div
            custom={isNext}
            variants={variants}
            animate={animate}
            transition={{
              x: { type: "tween", duration: duration, delay: 0 },
              opacity: { duration: duration },
            }}
            style={{ position: "relative", height: "100%" }}
          >
            <div ref={divRef} style={{ height: height }}>
              {child}
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </StyledItem>
  );
};
