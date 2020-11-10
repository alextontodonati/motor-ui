/* eslint-disable jsx-a11y/mouse-events-have-key-events */
import React, { useCallback, useContext, useEffect } from "react";
import ParentSize from "@visx/responsive/lib/components/ParentSize";

import DataContext from "../context/DataContext";
import { Margin } from "../types";
import useEventEmitter from "../hooks/useEventEmitter";
import EventEmitterProvider from "../providers/EventEmitterProvider";
import TooltipContext from "../context/TooltipContext";
import TooltipProvider from "../providers/TooltipProvider";

type Props = {
  accessibilityLabel?: string;
  events?: boolean;
  width?: number;
  height?: number;
  margin?: Margin;
  captureEvents?: boolean;
  onMouseDown?: any;
  children: React.ReactNode;
};

export default function Pie(props: Props) {
  const {
    accessibilityLabel = "Pie",
    children,
    width,
    height,
    margin,
    captureEvents = false,
    onMouseDown,
  } = props;
  const { setDimensions } = useContext(DataContext);
  const tooltipContext = useContext(TooltipContext);
  const emit = useEventEmitter();

  // update dimensions in context
  useEffect(() => {
    if (
      setDimensions &&
      width != null &&
      height != null &&
      width > 0 &&
      height > 0
    ) {
      setDimensions({ width, height, margin });
    }
  }, [setDimensions, width, height, margin]);

  const handleMouseTouchMove = useCallback(
    (event: React.MouseEvent | React.TouchEvent) => emit?.("mousemove", event),
    [emit]
  );
  const handleMouseOutTouchEnd = useCallback(
    (event: React.MouseEvent | React.TouchEvent) => emit?.("mouseout", event),
    [emit]
  );

  // if Context or dimensions are not available, wrap self in the needed providers
  if (width == null || height == null) {
    return <ParentSize>{(dims) => <Pie {...dims} {...props} />}</ParentSize>;
  }
  if (emit == null) {
    return (
      <EventEmitterProvider>
        <Pie {...props} />
      </EventEmitterProvider>
    );
  }
  if (tooltipContext == null) {
    return (
      <TooltipProvider>
        <Pie {...props} />
      </TooltipProvider>
    );
  }

  return width > 0 && height > 0 ? (
    <svg
      width={width}
      height={height}
      aria-label={accessibilityLabel}
      onMouseDown={onMouseDown}
    >
      {children}
      {/** capture all mouse/touch events and emit them. */}
      {captureEvents && (
        <rect
          x={margin.left}
          y={margin.top}
          width={width - margin.left - margin.right}
          // width={
          // width -
          // margin.left -
          // margin.right -
          // `${dualAxis ? margin.left : 0}`
          // }
          height={height - margin.top - margin.bottom}
          fill="transparent"
          onMouseMove={handleMouseTouchMove}
          onTouchMove={handleMouseTouchMove}
          onMouseOut={handleMouseOutTouchEnd}
          onTouchEnd={handleMouseOutTouchEnd}
        />
      )}
    </svg>
  ) : null;
}
