/* eslint-disable unicorn/consistent-function-scoping */
import React, { useState, useMemo, useEffect } from "react";
import defaultTheme from "../../theme/default";
import Axis from "../../components/Axis";
import AnimatedAxis from "../../components/AnimatedAxis";
import ChartProvider from "../../components/providers/ChartProvider";
import XYChart from "../../components/XYChart";
import BarSeries from "../../components/series/BarSeries";
import LineSeries from "../../components/series/LineSeries";
import ChartBackground from "../../components/ChartBackground";
import EventProvider from "../../components/providers/TooltipProvider";
import Tooltip, { RenderTooltipArgs } from "../../.../../components/Tooltip";
import Legend from "../../components/Legend";
import CustomLegendShape from "../../components/CustomLegendShape";
import Group from "../../components/series/Group";
import Stack from "../../components/series/Stack";

import {
  // roundNumber,
  // hyperCubeTransform,
  // getMeasureNames,
  // groupHyperCubeData,
  // stackHyperCubeData,
  colorByExpression,
} from "../../../../utils";

const numDateTicks = 5;

const Console = (prop) => (
  console[Object.keys(prop)[0]](...Object.values(prop)),
  null // ➜ React components must return something
);

const getDate = (d) =>
  new Date(
    d[0].qText.split("/")[2],
    d[0].qText.split("/")[1] - 1,
    d[0].qText.split("/")[0]
  );

const getSfTemperature = (d) => Number(d[2].qNum);
const getAustinTemperature = (d) => Number(d[1].qNum);
const getNyTemperature = (d) => Number(d[2].qNum);
const legendLabelFormat = (d) => d;

const axisTopMargin = { top: 40, right: 50, bottom: 30, left: 50 };
const axisBottomMargin = { top: 30, right: 50, bottom: 40, left: 50 };

/** memoize the accessor functions to prevent re-registering data. */
function useAccessors(temperatureAccessor, renderHorizontally) {
  return useMemo(
    () => ({
      xAccessor: (d) =>
        renderHorizontally ? temperatureAccessor(d) : getDate(d),
      yAccessor: (d) =>
        renderHorizontally ? getDate(d) : temperatureAccessor(d),
    }),
    [renderHorizontally, temperatureAccessor]
  );
}

export default function CreateCombo({
  width,
  height,
  events = false,
  qData: { qMatrix: data },
  qLayout: {
    qHyperCube,
    qHyperCube: { qMeasureInfo: measureInfo },
  },
  setRefreshChart,
  beginSelections,
  select,
  setSelectionComboVisible,
  useSelectionColours,
  pendingSelections,
  SetPendingSelections,
  colorPalette,
}) {
  // const [theme, setTheme] = useState("light");
  // const [useCustomDomain, setUseCustomDomain] = useState(false);
  const [currData, setCurrData] = useState(data);
  const [useAnimatedAxes, setUseAnimatedAxes] = useState(false);
  const [autoWidth, setAutoWidth] = useState(false);
  const [renderHorizontally, setRenderHorizontally] = useState(false);
  // const [negativeValues, setNegativeValues] = useState(false);
  const [includeZero, setIncludeZero] = useState(false);
  const [xAxisOrientation, setXAxisOrientation] = useState("bottom");
  const [yAxisOrientation, setYAxisOrientation] = useState("left");
  const [legendLeftRight, setLegendLeftRight] = useState("right");
  const [legendTopBottom, setLegendTopBottom] = useState("top");
  const [legendDirection, setLegendDirection] = useState("row");
  const [legendShape, setLegendShape] = useState("auto");
  const [snapTooltipToDataX, setSnapTooltipToDataX] = useState(true);
  const [snapTooltipToDataY, setSnapTooltipToDataY] = useState(true);
  const [chartType, setchartType] = useState(["bar", "line"]);
  const canSnapTooltipToDataX =
    (chartType.includes("groupedbar") && renderHorizontally) ||
    (chartType.includes("stackedbar") && !renderHorizontally) ||
    chartType.includes("bar");

  const canSnapTooltipToDataY =
    (chartType.includes("groupedbar") && !renderHorizontally) ||
    (chartType.includes("stackedbar") && renderHorizontally) ||
    chartType.includes("bar");

  const dateScaleConfig = useMemo(() => ({ type: "band", padding: 0.2 }), []);

  const renderTooltip = ({ closestData, closestDatum, colorScale }) => (
    <>
      <div>{closestDatum.datum[0].qText}</div>
      {/* <Console log={closestData[`${measureInfo[1].qFallbackTitle}`].datum[2]} /> */}
      <br />

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
              {closestData[`${measure.qFallbackTitle}`].datum[index + 1].qNum}
            </div>
          )
      )}
    </>
  );

  const temperatureScaleConfig = useMemo(
    () => ({
      type: "linear",
      clamp: true,
      nice: true,
      domain: undefined,
      includeZero,
    }),
    [includeZero]
  );

  const colorScaleConfig = useMemo(
    () => ({
      domain: measureInfo.map((d) => d.qFallbackTitle),
    }),
    [chartType]
  );

  const austinAccessors = useAccessors(
    getAustinTemperature,
    renderHorizontally
  );
  const sfAccessors = useAccessors(getSfTemperature, renderHorizontally);
  const nyAccessors = useAccessors(getNyTemperature, renderHorizontally);

  useEffect(() => {
    setCurrData(data);
  }, [data]);

  // Check if conditionalColors and if so get the returned color pallette
  const conditionalColors = colorByExpression(qHyperCube, data, colorPalette);
  const colors =
    conditionalColors.length !== 0 ? conditionalColors : colorPalette;

  const themeObj = {
    ...defaultTheme,
    colors: ["#00bfff", "#0040ff", "#654062"],
    // colors,
  };

  console.log(themeObj.colors);

  const AxisComponent = useAnimatedAxes ? AnimatedAxis : Axis;

  const legend = (
    <Legend
      labelFormat={legendLabelFormat}
      alignLeft={legendLeftRight === "left"}
      direction={legendDirection}
      shape={
        legendShape === "auto"
          ? undefined
          : legendShape === "custom"
          ? CustomLegendShape
          : legendShape
      }
    />
  );

  return (
    // <div className="container">

    <ChartProvider
      theme={themeObj}
      xScale={renderHorizontally ? temperatureScaleConfig : dateScaleConfig}
      yScale={renderHorizontally ? dateScaleConfig : temperatureScaleConfig}
      colorScale={colorScaleConfig}
    >
      <EventProvider>
        {legendTopBottom === "top" && legend}
        <div
          className="container"
          style={{
            position: "relative",
            width: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <XYChart
            height={height}
            width={autoWidth ? undefined : 1000}
            margin={
              xAxisOrientation === "top" ? axisTopMargin : axisBottomMargin
            }
          >
            <ChartBackground />

            {chartType.includes("bar") && (
              <BarSeries
                horizontal={renderHorizontally}
                dataKey={measureInfo[0].qFallbackTitle}
                data={currData}
                {...austinAccessors}
              />
            )}

            {chartType.includes("stackedbar") && (
              <Stack horizontal={renderHorizontally}>
                <BarSeries
                  dataKey={measureInfo[0].qFallbackTitle}
                  data={currData}
                  {...austinAccessors}
                />
                <BarSeries
                  dataKey={measureInfo[1].qFallbackTitle}
                  data={currData}
                  {...sfAccessors}
                />
                <BarSeries
                  dataKey={measureInfo[2].qFallbackTitle}
                  data={currData}
                  {...nyAccessors}
                />
              </Stack>
            )}
            {chartType.includes("groupedbar") && (
              <Group horizontal={renderHorizontally}>
                <BarSeries
                  dataKey={measureInfo[0].qFallbackTitle}
                  data={currData}
                  {...austinAccessors}
                />
                <BarSeries
                  dataKey={measureInfo[1].qFallbackTitle}
                  data={currData}
                  {...sfAccessors}
                />
                <BarSeries
                  dataKey={measureInfo[2].qFallbackTitle}
                  data={currData}
                  {...nyAccessors}
                />
              </Group>
            )}

            {chartType.includes("line") && (
              <>
                <LineSeries
                  // dataKey="sf"
                  dataKey={measureInfo[1].qFallbackTitle}
                  data={currData}
                  {...sfAccessors}
                  strokeWidth={1.5}
                />
              </>
            )}

            {/** Temperature axis */}
            <AxisComponent
              // label="Temperature (°F)"
              label={measureInfo[0].qFallbackTitle}
              orientation={
                renderHorizontally ? xAxisOrientation : yAxisOrientation
              }
              numTicks={5}
            />
            {/* <AxisComponent
                label={qLayout.measureInfo[1].qFallbackTitle}
              orientation="right"
              numTicks={5}
            /> */}
            {/** Date axis */}
            <AxisComponent
              orientation={
                renderHorizontally ? yAxisOrientation : xAxisOrientation
              }
              tickValues={currData
                .filter(
                  (d, i, arr) =>
                    i % Math.round((arr.length - 1) / numDateTicks) === 0
                )
                .map((d) => getDate(d))}
              tickFormat={(d) =>
                d.toISOString?.().split?.("T")[0] ?? d.toString()
              }
            />
          </XYChart>
          <Tooltip
            snapToDataX={snapTooltipToDataX && canSnapTooltipToDataX}
            snapToDataY={snapTooltipToDataY && canSnapTooltipToDataY}
            renderTooltip={renderTooltip}
          />
          {legendTopBottom === "bottom" && legend}
        </div>
      </EventProvider>
    </ChartProvider>
  );
}
