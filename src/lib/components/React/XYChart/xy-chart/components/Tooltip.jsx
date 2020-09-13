import React, { useContext } from "react";
import { TooltipWithBounds, Portal, defaultStyles } from "@vx/tooltip";
import { scaleOrdinal } from "@vx/scale";

import TooltipContext from "../context/TooltipContext";
import ChartContext from "../context/ChartContext";

export default function Tooltip({
  // renderTooltip,
  snapToDataX,
  snapToDataY,
  // showVerticalCrosshair = true,
  showVerticalCrosshair,
  renderInPortal = false,
}) {
  const { tooltipData } = useContext(TooltipContext) || {};
  const {
    margin,
    xScale,
    yScale,
    colorScale,
    dataRegistry,
    height,
    theme,
    formatValue,
    // dimensionInfo,
    measureInfo,
    dataKeys,
    singleDimension,
    singleMeasure,
  } = useContext(ChartContext) || {};

  // early return if there's no tooltip
  const {
    closestDatum,
    svgMouseX,
    svgMouseY,
    pageX,
    pageY,
    svgOriginX,
    svgOriginY,
  } = tooltipData || {};

  if (!closestDatum || svgMouseX == null || svgMouseY == null) return null;

  const { xAccessor, yAccessor } = dataRegistry[closestDatum.key];

  const xCoord = snapToDataX
    ? xScale(xAccessor(closestDatum.datum)) +
      (xScale.bandwidth?.() ?? 0) / 2 +
      (renderInPortal ? svgOriginX : 0)
    : renderInPortal
    ? pageX
    : svgMouseX;

  const yCoord = snapToDataY
    ? yScale(yAccessor(closestDatum.datum)) -
      (yScale.bandwidth?.() ?? 0) / 2 +
      (renderInPortal ? svgOriginY : 0)
    : renderInPortal
    ? pageY
    : svgMouseY;

  const Container = renderInPortal ? Portal : React.Fragment;

  const renderTooltip = ({ closestData, closestDatum, colorScale }) => (
    <>
      <div>{closestDatum.datum[0].qText}</div>
      {/* <Console log={closestDatum.datum[0].qText} /> */}
      <br />
      {singleDimension === 1 && singleMeasure && dataKeys && (
        <div
          style={{
            color: colorScale(`${closestDatum.datum[0].qText}`),
            textDecoration: "underline solid currentColor",
          }}
        >
          {measureInfo[0].qFallbackTitle}{" "}
          {formatValue(closestDatum.datum[1].qNum)}
        </div>
      )}
      {measureInfo.map(
        (measure, index) =>
          closestData?.[`${measure.qFallbackTitle}`] &&
          closestDatum.datum[0].qText ===
            closestData[`${measure.qFallbackTitle}`].datum[0].qText && (
            <div
              key={measure.qFallbackTitle}
              style={{
                color: colorScale(`${measure.qFallbackTitle}`),
                textDecoration:
                  closestDatum.key === `${measure.qFallbackTitle}`
                    ? "underline solid currentColor"
                    : "none",
              }}
            >
              {measure.qFallbackTitle}{" "}
              {formatValue(
                closestData[`${measure.qFallbackTitle}`].datum[index + 1].qNum
              )}
            </div>
          )
      )}
    </>
  );

  return (
    <Container>
      {/** @TODO not doing this in SVG is jank. Better solution? */}
      {yScale && showVerticalCrosshair && (
        <div
          style={{
            position: "absolute",
            width: 1,
            height: height - margin.top - margin.bottom,
            top: 0,
            left: 0,
            transform: `translate(${xCoord}px,${
              renderInPortal ? svgOriginY + margin.top : margin.top
            }px)`,
            borderLeft: `1px solid ${theme?.xAxisStyles?.stroke ?? "#222"}`,
            pointerEvents: "none",
          }}
        />
      )}
      <TooltipWithBounds
        left={xCoord}
        top={yCoord}
        style={{
          ...defaultStyles,
          background: theme?.baseColor ?? "white",
          color: theme?.xAxisStyles?.stroke ?? "#222",
        }}
      >
        {renderTooltip({ ...tooltipData, colorScale })}
      </TooltipWithBounds>
    </Container>
  );
}
