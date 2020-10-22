/* eslint-disable unicorn/consistent-function-scoping */
import React, { useContext, useMemo } from "react";
import cx from "classnames";
import { Axis as BaseAxis } from "@visx/axis";
import getLabelTransform from "../../utils/getLabelTransform";
import { Text } from "@visx/text";
import { animated } from "react-spring";

import AnimatedTicks from "./AnimatedTicks";
import ChartContext from "../../context/ChartContext";
import withDefinedContextScales from "../../enhancers/withDefinedContextScales";

const defaultLabelProps = {
  textAnchor: "middle",
  fontFamily: "Arial",
  fontSize: 10,
  fill: "#222",
};

function AnimatedAxis(props) {
  const {
    theme,
    xScale,
    yScale,
    margin,
    width,
    height,
    size,
    xAxisStyles,
    yAxisStyles,
    xTickStyles,
    yTickStyles,
  } = useContext(ChartContext);
  const { orientation } = props;

  // The biggest difference between Axes is their label + tick label styles
  // we take this from props if specified, else we figure it out from the chart theme
  const themeTickStylesKey =
    orientation === "left" || orientation === "right"
      ? "yTickStyles"
      : "xTickStyles";

  const tickStyles = useMemo(() => theme[themeTickStylesKey], [
    theme,
    themeTickStylesKey,
  ]);

  const ticksPropsStyles =
    orientation === "left" || orientation === "right"
      ? yTickStyles
      : xTickStyles;

  const tickLabelProps = useMemo(() => {
    // if (props.tickLabelProps) return props.tickLabelProps;
    const themeTickLabelProps =
      theme?.[themeTickStylesKey]?.label?.[orientation];
    return themeTickLabelProps
      ? // by default, wrap tick labels within the allotted margin space
        () => ({
          ...themeTickLabelProps,
          width: margin[orientation],
          fontSize:
            theme?.[themeTickStylesKey]?.label?.[orientation].fontSize[size],
          ...ticksPropsStyles,
        })
      : undefined;
  }, [theme, props.tickLabelProps, themeTickStylesKey, orientation, margin]);

  // extract axis styles from theme
  const themeAxisStylesKey =
    orientation === "left" || orientation === "right"
      ? "yAxisStyles"
      : "xAxisStyles";

  const axisStyles = useMemo(() => theme[themeAxisStylesKey], [
    theme,
    themeAxisStylesKey,
  ]);

  const topOffset =
    orientation === "bottom"
      ? height - margin.bottom
      : orientation === "top"
      ? margin.top
      : 0;
  const leftOffset =
    orientation === "left"
      ? margin.left
      : orientation === "right"
      ? width - margin.right
      : 0;

  const scale =
    orientation === "left" || orientation === "right" ? yScale : xScale;

  const axisPropsStyles =
    orientation === "left" || orientation === "right"
      ? yAxisStyles
      : xAxisStyles;

  const tickStroke = props.tickStroke ?? tickStyles?.stroke;
  const tickLength = props.tickLength ?? tickStyles?.tickLength;
  const axisStroke = props.stroke ?? axisStyles?.stroke;
  const axisStrokeWidth = props.strokeWidth ?? axisStyles?.strokeWidth;
  const axisLabelOffset = props.labelOffset ?? 18; // was 14
  const axisLabelProps =
    (props.labelProps || {
      ...axisStyles?.label?.[orientation],
      fontSize: axisStyles?.label?.[orientation].fontSize[size],
      ...axisPropsStyles,
    }) ??
    defaultLabelProps;

  return (
    <BaseAxis
      top={topOffset}
      left={leftOffset}
      {...props}
      tickLength={tickLength}
      scale={scale}
    >
      {({ axisFromPoint, axisToPoint, horizontal, ticks }) => (
        <>
          <AnimatedTicks
            width={width}
            margin={margin}
            height={height}
            ticks={ticks}
            horizontal={horizontal}
            tickStroke={tickStroke}
            tickLabelProps={tickLabelProps}
            orientation={orientation}
            scale={scale}
            hideTicks={props.hideTicks}
            tickClassName={props.tickClassName}
          />

          {!props.hideAxisLine && (
            <animated.line
              className={cx("visx-axis-line", props.axisLineClassName)}
              x1={axisFromPoint.x}
              x2={axisToPoint.x}
              y1={axisFromPoint.y}
              y2={axisToPoint.y}
              stroke={axisStroke}
              strokeWidth={axisStrokeWidth}
              strokeDasharray={props.strokeDasharray}
            />
          )}
          {props.label && (
            <Text
              className={cx("visx-axis-label", props.labelClassName)}
              {...getLabelTransform({
                labelOffset: axisLabelOffset,
                labelProps: axisLabelProps,
                orientation,
                range: scale.range(),
                tickLabelFontSize: 0, // @TODO this doesn't seem to matter?
                tickLength,
              })}
              {...axisLabelProps}
            >
              {props.label}
            </Text>
          )}
        </>
      )}
    </BaseAxis>
  );
}

// AnimatedAxis shouldn't render unless scales are available in context
export default withDefinedContextScales(AnimatedAxis);
