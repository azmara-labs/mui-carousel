import { useCallback, useEffect, useMemo, useState } from "react";
import { CarouselItem } from "./CarouselItem.js";
import { Indicators } from "./Indicators.js";
import { StyledButtonWrapper, StyledIconButton, StyledItemWrapper, StyledRoot } from "./Styled.js";
import type { CarouselProps } from "./types";
import { sanitizeProps, useInterval } from "./util.js";

export const Carousel = (props: CarouselProps) => {
  const [state, setState] = useState({
    active: 0,
    prevActive: 0,
    next: true,
  });

  /** Used to set carousel's height. It is being set by the CarouselItems */
  const [childrenHeight, setChildrenHeight] = useState<number>();
  const [paused, setPaused] = useState<boolean>(false);

  const sanitizedProps = sanitizeProps(props);

  useInterval(() => {
    const { autoPlay } = sanitizedProps;

    if (autoPlay && !paused) {
      next(undefined);
    }
  }, sanitizedProps.interval);

  // Memoized setNext function - must be defined before next/prev
  const setNext = useCallback(
    (index: number, isNext?: boolean, runCallbacks: boolean = true) => {
      const { onChange, children, strictIndexing } = sanitizedProps;

      if (Array.isArray(children)) {
        if (strictIndexing && index > children.length - 1) index = children.length - 1;
        if (strictIndexing && index < 0) index = 0;
      } else {
        index = 0;
      }

      if (runCallbacks) {
        if (isNext !== undefined)
          isNext
            ? sanitizedProps.next(index, state.active)
            : sanitizedProps.prev(index, state.active);

        onChange(index, state.active);
      }

      if (isNext === undefined) {
        isNext = index > state.active;
      }

      setState({
        active: index,
        prevActive: state.active,
        next: isNext,
      });
    },
    [sanitizedProps, state.active],
  );

  // componentDidMount & onIndexChange
  // Deliberately depends only on the primitive index value, not sanitizedProps/setNext -
  // sanitizeProps() returns a new object (with new default fn/JSX refs) on every render,
  // so depending on it (or anything derived from it) here would re-fire this effect every
  // render, call setState every time, and loop forever ("Maximum update depth exceeded").
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const { index, changeOnFirstRender } = sanitizedProps;
    setNext(index, true, changeOnFirstRender);
  }, [sanitizedProps.index]);

  const next = useCallback(
    (event: any) => {
      const { children, cycleNavigation } = sanitizedProps;

      const last = Array.isArray(children) ? children.length - 1 : 0;
      const nextActive =
        state.active + 1 > last ? (cycleNavigation ? 0 : state.active) : state.active + 1;

      setNext(nextActive, true);

      if (event) event.stopPropagation();
    },
    [sanitizedProps, state.active, setNext],
  );

  const prev = useCallback(
    (event: any) => {
      const { children, cycleNavigation } = sanitizedProps;

      const last = Array.isArray(children) ? children.length - 1 : 0;
      const nextActive =
        state.active - 1 < 0 ? (cycleNavigation ? last : state.active) : state.active - 1;

      setNext(nextActive, false);

      if (event) event.stopPropagation();
    },
    [sanitizedProps, state.active, setNext],
  );

  const {
    children,
    sx,
    className,

    height,

    stopAutoPlayOnHover,
    animation,
    duration,
    swipe,

    navButtonsAlwaysInvisible,
    navButtonsAlwaysVisible,
    cycleNavigation,
    fullHeightHover,
    navButtonsProps,
    navButtonsWrapperProps,
    NavButton,

    NextIcon,
    PrevIcon,

    indicators,
    indicatorContainerProps,
    indicatorIconButtonProps,
    activeIndicatorIconButtonProps,
    IndicatorIcon,

    ariaLabel,
    keyboardNavigation,
  } = sanitizedProps;

  const childrenLength = Array.isArray(children) ? children.length : 1;

  // Keyboard navigation
  useEffect(() => {
    if (!keyboardNavigation) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          prev(undefined);
          setPaused(true);
          break;
        case "ArrowRight":
          e.preventDefault();
          next(undefined);
          setPaused(true);
          break;
        case "Home":
          e.preventDefault();
          setNext(0, false);
          setPaused(true);
          break;
        case "End": {
          e.preventDefault();
          const last = childrenLength - 1;
          setNext(last, true);
          setPaused(true);
          break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [keyboardNavigation, next, prev, setNext, childrenLength]);

  const showButton = useCallback(
    (next = true) => {
      if (cycleNavigation) return true;

      const last = Array.isArray(children) ? children.length - 1 : 0;

      if (next && state.active === last) return false;
      if (!next && state.active === 0) return false;

      return true;
    },
    [cycleNavigation, children, state.active],
  );

  // Memoize carousel items rendering
  const carouselItems = useMemo(() => {
    return Array.isArray(children) ? (
      children.map((child, index) => {
        return (
          <CarouselItem
            key={`carousel-item${index}`}
            state={state}
            index={index}
            maxIndex={children.length - 1}
            child={child}
            animation={animation}
            duration={duration}
            swipe={swipe}
            next={next}
            prev={prev}
            height={height}
            setHeight={setChildrenHeight}
          />
        );
      })
    ) : (
      <CarouselItem
        key={`carousel-item0`}
        state={state}
        index={0}
        maxIndex={0}
        child={children}
        animation={animation}
        duration={duration}
        height={height}
        setHeight={setChildrenHeight}
      />
    );
  }, [children, state, animation, duration, swipe, next, prev, height]);

  return (
    <StyledRoot
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      tabIndex={keyboardNavigation ? 0 : undefined}
      sx={sx}
      className={className}
      onMouseOver={() => {
        stopAutoPlayOnHover && setPaused(true);
      }}
      onMouseOut={() => {
        stopAutoPlayOnHover && setPaused(false);
      }}
      onFocus={() => {
        stopAutoPlayOnHover && setPaused(true);
      }}
      onBlur={() => {
        stopAutoPlayOnHover && setPaused(false);
      }}
      // style={{height: height}} // <-- number | undefined
    >
      {/* Screen reader announcements */}
      <div
        style={{
          position: "absolute",
          width: "1px",
          height: "1px",
          padding: 0,
          margin: "-1px",
          overflow: "hidden",
          clip: "rect(0, 0, 0, 0)",
          whiteSpace: "nowrap",
          borderWidth: 0,
        }}
        aria-live="polite"
        aria-atomic="true"
      >
        Item {state.active + 1} of {childrenLength}
      </div>

      <StyledItemWrapper style={{ height: height ? height : childrenHeight }}>
        {carouselItems}
      </StyledItemWrapper>

      {!navButtonsAlwaysInvisible && showButton(true) && (
        <StyledButtonWrapper
          $next
          $prev={false}
          $fullHeightHover={fullHeightHover}
          {...navButtonsWrapperProps}
        >
          {NavButton !== undefined ? (
            NavButton({ onClick: next, next: true, prev: false, ...navButtonsProps })
          ) : (
            <StyledIconButton
              $alwaysVisible={navButtonsAlwaysVisible}
              $fullHeightHover={fullHeightHover}
              onClick={next}
              aria-label="Next"
              {...navButtonsProps}
            >
              {NextIcon}
            </StyledIconButton>
          )}
        </StyledButtonWrapper>
      )}

      {!navButtonsAlwaysInvisible && showButton(false) && (
        <StyledButtonWrapper
          $next={false}
          $prev
          $fullHeightHover={fullHeightHover}
          {...navButtonsWrapperProps}
        >
          {NavButton !== undefined ? (
            NavButton({ onClick: prev, next: false, prev: true, ...navButtonsProps })
          ) : (
            <StyledIconButton
              $alwaysVisible={navButtonsAlwaysVisible}
              $fullHeightHover={fullHeightHover}
              onClick={prev}
              aria-label="Previous"
              {...navButtonsProps}
            >
              {PrevIcon}
            </StyledIconButton>
          )}
        </StyledButtonWrapper>
      )}

      {indicators ? (
        <Indicators
          length={Array.isArray(children) ? children.length : 0}
          active={state.active}
          press={setNext}
          indicatorContainerProps={indicatorContainerProps}
          indicatorIconButtonProps={indicatorIconButtonProps}
          activeIndicatorIconButtonProps={activeIndicatorIconButtonProps}
          IndicatorIcon={IndicatorIcon}
        />
      ) : null}
    </StyledRoot>
  );
};

export default Carousel;
