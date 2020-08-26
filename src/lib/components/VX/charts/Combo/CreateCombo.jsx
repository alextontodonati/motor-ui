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

const axisTopMargin = { top: 40, right: 50, bottom: 30, left: 50 };
const axisBottomMargin = { top: 30, right: 50, bottom: 40, left: 50 };

const legendLabelFormat = (d) => {
  console.log("legendLabelFormat", d);
  return d === "sf" ? "San Francisco" : d === "austin" ? "Austin" : d;
};

const renderTooltip = ({ closestData, closestDatum, colorScale }) => (
  <>
    <div>{closestDatum.datum[0].qText}</div>
    {/* <div>
      {closestDatum.datum[0].qNum.toISOString?.().split?.("T")[0] ??
        closestDatum.datum[0].qText.toString()}
    </div> */}
    {/* <Console log={closestData.austin.datum[1].qNum} /> */}
    <br />
    {closestData?.sf &&
      closestDatum.datum[0].qText === closestData.sf.datum[0].qText && (
        <div
          style={{
            color: colorScale("sf"),
            textDecoration:
              closestDatum.key === "sf"
                ? "underline solid currentColor"
                : "none",
          }}
        >
          {/* San Francisco {closestData.sf.datum["San Francisco"]}°F */}
          San Francisco {closestData.sf.datum[2].qNum}°F
        </div>
      )}
    {closestData?.ny &&
      closestDatum.datum[0].qText === closestData.ny.datum[0].qText && (
        <div
          style={{
            color: colorScale("ny"),
            textDecoration:
              closestDatum.key === "ny"
                ? "underline solid currentColor"
                : "none",
          }}
        >
          New York {closestData.ny.datum[1].qNum}°F
        </div>
      )}
    {closestData?.austin &&
      closestDatum.datum[0].qText === closestData.austin.datum[0].qText && (
        <div
          style={{
            color: colorScale("austin"),
            textDecoration:
              closestDatum.key === "austin"
                ? "underline solid currentColor"
                : "none",
          }}
        >
          Austin {closestData.austin.datum[1].qNum}°F
        </div>
      )}
  </>
);

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
  qLayout,
  setRefreshChart,
  beginSelections,
  select,
  setSelectionBarVisible,
  useSelectionColours,
  pendingSelections,
  SetPendingSelections,
}) {
  // const data = cityTemperature.slice(100, 100 + 16);
  // console.log(qLayout.qHyperCube.qMeasureInfo[0].qFallbackTitle);
  // const data = qMatrix;
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
  const [visibleSeries, setVisibleSeries] = useState(["bar", "line"]);
  const canSnapTooltipToDataX =
    (visibleSeries.includes("groupedbar") && renderHorizontally) ||
    (visibleSeries.includes("stackedbar") && !renderHorizontally) ||
    visibleSeries.includes("bar");

  const canSnapTooltipToDataY =
    (visibleSeries.includes("groupedbar") && !renderHorizontally) ||
    (visibleSeries.includes("stackedbar") && renderHorizontally) ||
    visibleSeries.includes("bar");

  const dateScaleConfig = useMemo(() => ({ type: "band", padding: 0.2 }), []);

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
      domain:
        visibleSeries.includes("bar") && !visibleSeries.includes("line")
          ? ["austin"]
          : // : ["austin", "sf", "ny"],
            ["austin", "sf"],
    }),
    [visibleSeries]
  );

  // const colorScaleConfig = useMemo(
  //   () => ({
  //     domain: qLayout.qHyperCube.qMeasureInfo.map((d) => d.qFallbackTitle),
  //   }),
  //   [visibleSeries]
  // );

  const austinAccessors = useAccessors(
    getAustinTemperature,
    renderHorizontally
  );
  const sfAccessors = useAccessors(getSfTemperature, renderHorizontally);

  useEffect(() => {
    setCurrData(data);
  }, [data]);

  // const themeObj = useMemo(
  //   () =>
  //     theme === "light"
  //       ? { ...defaultTheme, colors: ["#00bfff", "#0040ff", "#654062"] }
  //       : theme === "dark"
  //       ? { ...darkTheme, colors: ["#916dd5", "#f8615a", "#ffd868"] }
  //       : { colors: ["#222", "#767676", "#bbb"] },
  //   [theme]
  // );

  const themeObj = {
    ...defaultTheme,
    colors: ["#00bfff", "#0040ff", "#654062"],
  };

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

            {visibleSeries.includes("bar") && (
              <BarSeries
                horizontal={renderHorizontally}
                dataKey="austin"
                // dataKey={qLayout.qHyperCube.qMeasureInfo[0].qFallbackTitle}
                data={currData}
                {...austinAccessors}
              />
            )}

            {visibleSeries.includes("line") && (
              <>
                <LineSeries
                  dataKey="sf"
                  data={currData}
                  {...sfAccessors}
                  strokeWidth={1.5}
                />
              </>
            )}

            {/** Temperature axis */}
            <AxisComponent
              // label="Temperature (°F)"
              label={qLayout.qHyperCube.qMeasureInfo[0].qFallbackTitle}
              orientation={
                renderHorizontally ? xAxisOrientation : yAxisOrientation
              }
              numTicks={5}
            />
            {/* <AxisComponent
                label={qLayout.qHyperCube.qMeasureInfo[1].qFallbackTitle}
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
