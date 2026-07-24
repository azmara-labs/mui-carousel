import NavigateBefore from "@mui/icons-material/NavigateBefore";
import NavigateNext from "@mui/icons-material/NavigateNext";
import type { Theme } from "@mui/material";
import type { SxProps } from "@mui/system";
import type React from "react";
import { type ReactNode, useEffect, useRef } from "react";
import type { CarouselNavProps, CarouselProps } from "./types";

export interface SanitizedCarouselProps extends CarouselProps {
  sx: SxProps<Theme>;
  className: string;
  children: ReactNode;

  height: number | string | undefined;

  index: number;
  strictIndexing: boolean;

  autoPlay: boolean;
  stopAutoPlayOnHover: boolean;
  interval: number;

  animation: "fade" | "slide";
  duration: number;

  swipe: boolean;

  navButtonsAlwaysInvisible: boolean;
  navButtonsAlwaysVisible: boolean;
  cycleNavigation: boolean;
  fullHeightHover: boolean;
  navButtonsWrapperProps: SanitizedCarouselNavProps;
  navButtonsProps: SanitizedCarouselNavProps;
  NavButton:
    | (({
        onClick,
        next,
        className,
        style,
        prev,
      }: {
        onClick: (event: React.MouseEvent) => void;
        className: string;
        style: React.CSSProperties;
        next: boolean;
        prev: boolean;
      }) => ReactNode)
    | undefined;

  NextIcon: ReactNode;
  PrevIcon: ReactNode;

  indicators: boolean;
  indicatorContainerProps: SanitizedCarouselNavProps;
  indicatorIconButtonProps: SanitizedCarouselNavProps;
  activeIndicatorIconButtonProps: SanitizedCarouselNavProps;
  IndicatorIcon: ReactNode;

  onChange: (now?: number, previous?: number) => void;
  changeOnFirstRender: boolean;
  next: (now?: number, previous?: number) => void;
  prev: (now?: number, previous?: number) => void;

  ariaLabel: string;
  keyboardNavigation: boolean;
}

export interface SanitizedCarouselNavProps extends CarouselNavProps {
  style: React.CSSProperties;
  className: string;
}

export const sanitizeNavProps = (
  props: CarouselNavProps | undefined,
): SanitizedCarouselNavProps => {
  const { className, style, ...rest } = props || {};

  return props !== undefined
    ? {
        style: props.style !== undefined ? props.style : {},
        className: props.className !== undefined ? props.className : "",
        ...rest,
      }
    : { style: {}, className: "", ...rest };
};

export const sanitizeProps = (props: CarouselProps): SanitizedCarouselProps => {
  const animation = props.animation !== undefined ? props.animation : "fade";
  const duration = props.duration !== undefined ? props.duration : animation === "fade" ? 500 : 200;

  return {
    sx: props.sx !== undefined ? props.sx : {},
    className: props.className !== undefined ? props.className : "",
    children: props.children ? props.children : [],

    height: props.height,

    index: props.index !== undefined ? props.index : 0,
    strictIndexing: props.strictIndexing !== undefined ? props.strictIndexing : true,

    autoPlay: props.autoPlay !== undefined ? props.autoPlay : true,
    stopAutoPlayOnHover: props.stopAutoPlayOnHover !== undefined ? props.stopAutoPlayOnHover : true,
    interval: props.interval !== undefined ? props.interval : 4000,

    animation: animation,
    duration: duration,

    swipe: props.swipe !== undefined ? props.swipe : true,

    navButtonsAlwaysInvisible:
      props.navButtonsAlwaysInvisible !== undefined ? props.navButtonsAlwaysInvisible : false,
    navButtonsAlwaysVisible:
      props.navButtonsAlwaysVisible !== undefined ? props.navButtonsAlwaysVisible : false,
    cycleNavigation: props.cycleNavigation !== undefined ? props.cycleNavigation : true,
    fullHeightHover: props.fullHeightHover !== undefined ? props.fullHeightHover : true,
    navButtonsWrapperProps: sanitizeNavProps(props.navButtonsWrapperProps),
    navButtonsProps: sanitizeNavProps(props.navButtonsProps),
    NavButton: props.NavButton,

    NextIcon: props.NextIcon !== undefined ? props.NextIcon : <NavigateNext />,
    PrevIcon: props.PrevIcon !== undefined ? props.PrevIcon : <NavigateBefore />,

    indicators: props.indicators !== undefined ? props.indicators : true,
    indicatorContainerProps: sanitizeNavProps(props.indicatorContainerProps),
    indicatorIconButtonProps: sanitizeNavProps(props.indicatorIconButtonProps),
    activeIndicatorIconButtonProps: sanitizeNavProps(props.activeIndicatorIconButtonProps),
    IndicatorIcon: props.IndicatorIcon,

    onChange: props.onChange !== undefined ? props.onChange : () => {},
    changeOnFirstRender:
      props.changeOnFirstRender !== undefined ? props.changeOnFirstRender : false,
    next: props.next !== undefined ? props.next : () => {},
    prev: props.prev !== undefined ? props.prev : () => {},

    ariaLabel: props.ariaLabel !== undefined ? props.ariaLabel : "Carousel",
    keyboardNavigation: props.keyboardNavigation !== undefined ? props.keyboardNavigation : true,
  };
};

export const useInterval = (callback: Function, delay: number) => {
  const savedCallback = useRef<Function>(() => {});

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }

    return () => {};
  }, [delay]);
};
