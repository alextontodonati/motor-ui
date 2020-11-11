import React, { useContext, useCallback, useMemo } from "react";
import { LegendOrdinal, LegendItem, LegendLabel } from "@visx/legend";
import { RectShape, LineShape, CircleShape } from "@visx/legend";

import DataContext from "../../context/DataContext";
import { selectColor } from "../../../../utils";
// import { array } from "prop-types";

import createOrdinalScale from "@visx/scale/lib/scales/ordinal";

export default function Legend({
  shape: Shape,
  legendLeftRight,
  legendDirection,
  dataKeys,
  style,
  size = "medium",
  ...props
}) {
  const {
    theme,
    theme: { legendStyles: legendStyle },
    margin,
    // colorScale,
    // dataRegistry,
    legendLabelStyle,
  } = useContext(DataContext);

  const colorScale = useMemo(
    () =>
      createOrdinalScale({
        domain: dataKeys,
        range: theme.colors,
      }),
    [dataKeys, theme.colors]
  );

  const direction = legendDirection
    ? legendDirection
    : legendStyle
    ? legendStyle.direction
    : "row";

  const alignLeft = legendLeftRight
    ? legendLeftRight === "left"
      ? true
      : false
    : legendStyle
    ? legendStyle.alignLeft
    : false;

  const legendGlyphSize = legendStyle ? legendStyle.legendGlyphSize : 15;

  const legendStyles: any = useMemo(
    () => ({
      display: "flex",
      flexDirection: direction,
      background: legendStyle
        ? selectColor(legendStyle.backgroundColor, theme)
        : "white",
      color: legendLabelStyle
        ? selectColor(legendLabelStyle.fill, theme)
        : selectColor(theme?.legendLabelStyles?.fill, theme),
      paddingLeft: legendStyle ? legendStyle.margin.left : margin.left,
      paddingRight: legendStyle ? legendStyle.margin.right : margin.right,
      paddingBottom: legendStyle
        ? legendStyle.margin.bottom
        : `${Math.min(10, margin.bottom)}px`,

      [direction === "row" || direction === "row-reverse"
        ? "justifyContent"
        : "alignItems"]: alignLeft ? "flex-start" : "flex-end",
      style,
      overflow: "hidden",
    }),
    [theme, margin, alignLeft, direction, style, legendLabelStyle]
  );

  const legendLabelProps = useMemo(
    () => ({
      ...theme.legendLabelStyles,
      fontSize: theme.legendLabelStyles.fontSize[size],
      ...legendLabelStyle,
    }),
    [theme]
  );

  const isUpperCase = legendStyle ? legendStyle.upperCase : false;

  const LegendComponent = LegendOrdinal;

  const renderText = (label) => (isUpperCase ? label.toUpperCase() : label);

  const renderShape = useCallback(
    (legendGlyphSize, value, customShape = null) => {
      switch (customShape || Shape) {
        case "circle":
          return (
            <CircleShape
              fill={value}
              width={legendGlyphSize}
              height={legendGlyphSize}
            />
          );
        case "line":
          return (
            <LineShape
              fill={value}
              width={legendGlyphSize}
              height={legendGlyphSize}
            />
          );
        case "dashed-line":
          return (
            <LineShape
              fill={value}
              width={legendGlyphSize}
              height={legendGlyphSize}
              style={{ strokeDasharray: "5,3" }}
            />
          );
        case "rect":
        default:
          return (
            <RectShape
              fill={value}
              width={legendGlyphSize}
              height={legendGlyphSize}
              style={style}
            />
          );
      }
    },
    [Shape]
  );

  return props.scale || colorScale ? (
    <LegendComponent
      scale={colorScale}
      labelFormat={(label) => `${renderText(label)}`}
    >
      {(labels) => (
        <div className="visx-legend" style={legendStyles}>
          {labels.map((label, i) => (
            <LegendItem
              key={`legend-quantile-${i}`}
              margin="0 5px"
              // onClick={() => {
              //   // if (events) alert(`clicked: ${JSON.stringify(label)}`);
              //   console.log(`clicked: ${JSON.stringify(label)}`);
              // }}
            >
              {renderShape(
                legendGlyphSize,
                label.value,
                typeof Shape === "object" && Shape[i] != undefined
                  ? Shape[i]
                  : null
              )}
              <LegendLabel align="left" style={legendLabelProps}>
                {label.text}
              </LegendLabel>
            </LegendItem>
          ))}
        </div>
      )}
    </LegendComponent>
  ) : null;
}
