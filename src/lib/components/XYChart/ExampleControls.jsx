/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useMemo, useState } from "react";
// import { lightTheme, darkTheme } from "../visx";
import cityTemperature from "@visx/mock-data/lib/mocks/cityTemperature";
// import { buildChartTheme } from "../visx";

// const customTheme = () =>
//   buildChartTheme({
//     backgroundColor: "#f09ae9",
//     colors: ["rgba(255,231,143,0.8)", "#6a097d", "#d6e0f0"],
//     gridColor: "#336d88",
//     gridColorDark: "#1d1b38",
//     labelStyles: { fill: "#1d1b38" },
//     tickLength: 8,
//   });

const numTicks = 4;
const data = cityTemperature.slice(200, 275);
const dataSmall = data.slice(0, 25);

export default function ExampleControls({ children }) {
  const [animationTrajectory, setAnimationTrajectory] = useState("center");
  const [gridProps, setGridProps] = useState([false, false]);
  const [showGridRows, showGridColumns] = gridProps;
  const [renderHorizontally, setRenderHorizontally] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  const [showVerticalCrosshair, setShowVerticalCrosshair] = useState(true);
  const [showHorizontalCrosshair, setShowHorizontalCrosshair] = useState(false);
  const [snapTooltipToDatumX, setSnapTooltipToDatumX] = useState(true);
  const [snapTooltipToDatumY, setSnapTooltipToDatumY] = useState(true);
  const [sharedTooltip, setSharedTooltip] = useState(true);
  const [renderBarStackOrGroup, setRenderBarStackOrGroup] = useState("group");
  const [renderLineSeries, setRenderLineSeries] = useState(false);

  return (
    <>
      {children({
        animationTrajectory,
        data: renderBarStackOrGroup === "bar" ? data : dataSmall,
        numTicks,
        renderBarGroup: renderBarStackOrGroup === "group",
        renderBarSeries: renderBarStackOrGroup === "bar",
        renderBarStack: renderBarStackOrGroup === "stack",
        // renderHorizontally,
        renderLineSeries: renderBarStackOrGroup === "bar" && renderLineSeries,
        sharedTooltip,
        showGridColumns,
        showGridRows,
        showHorizontalCrosshair,
        showTooltip,
        showVerticalCrosshair,
        snapTooltipToDatumX:
          renderBarStackOrGroup !== "stack" && snapTooltipToDatumX,
        snapTooltipToDatumY:
          renderBarStackOrGroup !== "stack" && snapTooltipToDatumY,
        // theme,
      })}
      <div className="controls">
        {/** series orientation */}
        <div>
          <strong>series orientation</strong>
          <label>
            <input
              type="radio"
              onChange={() => setRenderHorizontally(false)}
              checked={!renderHorizontally}
            />{" "}
            vertical
          </label>
          <label>
            <input
              type="radio"
              onChange={() => setRenderHorizontally(true)}
              checked={renderHorizontally}
            />{" "}
            horizontal
          </label>
        </div>

        {/** grid */}
        <div>
          <strong>grid</strong>
          <label>
            <input
              type="radio"
              onChange={() => setGridProps([true, false])}
              checked={showGridRows && !showGridColumns}
            />{" "}
            rows
          </label>
          <label>
            <input
              type="radio"
              onChange={() => setGridProps([false, true])}
              checked={!showGridRows && showGridColumns}
            />{" "}
            columns
          </label>
          <label>
            <input
              type="radio"
              onChange={() => setGridProps([true, true])}
              checked={showGridRows && showGridColumns}
            />{" "}
            both
          </label>
          <label>
            <input
              type="radio"
              onChange={() => setGridProps([false, false])}
              checked={!showGridRows && !showGridColumns}
            />{" "}
            none
          </label>
        </div>
        {/** animation trajectory */}
        <div>
          <strong>axis + grid animation</strong>
          <label>
            <input
              type="radio"
              onChange={() => setAnimationTrajectory("center")}
              checked={animationTrajectory === "center"}
            />{" "}
            from center
          </label>
          <label>
            <input
              type="radio"
              onChange={() => setAnimationTrajectory("outside")}
              checked={animationTrajectory === "outside"}
            />{" "}
            from outside
          </label>
          <label>
            <input
              type="radio"
              onChange={() => setAnimationTrajectory("min")}
              checked={animationTrajectory === "min"}
            />{" "}
            from min
          </label>
          <label>
            <input
              type="radio"
              onChange={() => setAnimationTrajectory("max")}
              checked={animationTrajectory === "max"}
            />{" "}
            from max
          </label>
        </div>
        {/** tooltip */}
        <div>
          <strong>tooltip</strong>
          <label>
            <input
              type="checkbox"
              onChange={() => setShowTooltip(!showTooltip)}
              checked={showTooltip}
            />{" "}
            show tooltip
          </label>
          <label>
            <input
              type="checkbox"
              disabled={!showTooltip || renderBarStackOrGroup === "stack"}
              onChange={() => setSnapTooltipToDatumX(!snapTooltipToDatumX)}
              checked={showTooltip && snapTooltipToDatumX}
            />{" "}
            snap tooltip to datum x
          </label>
          <label>
            <input
              type="checkbox"
              disabled={!showTooltip || renderBarStackOrGroup === "stack"}
              onChange={() => setSnapTooltipToDatumY(!snapTooltipToDatumY)}
              checked={showTooltip && snapTooltipToDatumY}
            />{" "}
            snap tooltip to datum y
          </label>
          <label>
            <input
              type="checkbox"
              disabled={!showTooltip}
              onChange={() => setShowVerticalCrosshair(!showVerticalCrosshair)}
              checked={showTooltip && showVerticalCrosshair}
            />{" "}
            vertical crosshair
          </label>
          <label>
            <input
              type="checkbox"
              disabled={!showTooltip}
              onChange={() =>
                setShowHorizontalCrosshair(!showHorizontalCrosshair)
              }
              checked={showTooltip && showHorizontalCrosshair}
            />{" "}
            horizontal crosshair
          </label>
          <label>
            <input
              type="checkbox"
              disabled={!showTooltip}
              onChange={() => setSharedTooltip(!sharedTooltip)}
              checked={showTooltip && sharedTooltip}
            />{" "}
            shared tooltip
          </label>
        </div>
        {/** series */}
        <div>
          <strong>series</strong>
          <label>
            <input
              type="checkbox"
              disabled={renderBarStackOrGroup !== "bar"}
              onChange={() => setRenderLineSeries(!renderLineSeries)}
              checked={renderLineSeries}
            />{" "}
            line
          </label>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <label>
            <input
              type="radio"
              onChange={() => setRenderBarStackOrGroup("bar")}
              checked={renderBarStackOrGroup === "bar"}
            />{" "}
            bar
          </label>
          <label>
            <input
              type="radio"
              onChange={() => setRenderBarStackOrGroup("stack")}
              checked={renderBarStackOrGroup === "stack"}
            />{" "}
            bar stack
          </label>
          <label>
            <input
              type="radio"
              onChange={() => setRenderBarStackOrGroup("group")}
              checked={renderBarStackOrGroup === "group"}
            />{" "}
            bar group
          </label>
        </div>
      </div>
    </>
  );
}
