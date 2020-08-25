import React, { useMemo } from "react";
import { Bar } from "@vx/shape";
import { Group } from "@vx/group";
import { GradientTealBlue } from "@vx/gradient"; // npm up to date
import { scaleBand, scaleLinear, scaleOrdinal } from "@vx/scale"; // npm up to date
import { LegendOrdinal } from "@vx/legend"; // npm up to date
import { AxisBottom, AxisLeft } from "@vx/axis"; // npm up to date

const verticalMargin = 120;

// accessors
const getBand = (d) => d[0].qText;
const getElemNumber = (d) => d[0].qElemNumber;
const getValue = (d) => Number(d[1].qNum);

const colors = [
  "#3366CC",
  "#DC3912",
  "#FF9900",
  "#109618",
  "#990099",
  "#3B3EAC",
  "#0099C6",
  "#DD4477",
  "#66AA00",
  "#B82E2E",
  "#316395",
  "#994499",
  "#22AA99",
  "#AAAA11",
  "#6633CC",
  "#E67300",
  "#8B0707",
  "#329262",
  "#5574A6",
  "#3B3EAC",
];

export default function CreateBarSeries({
  width,
  height,
  events = false,
  qData,
  setRefreshChart,
  beginSelections,
  select,
  setSelectionBarVisible,
  useSelectionColours,
  pendingSelections,
  SetPendingSelections,
}) {
  // bounds
  const xMax = width;
  const yMax = height - verticalMargin;

  const axsiColor = "white";

  const colorScale = scaleOrdinal({
    domain: qData.qMatrix.map(getBand),
    range: colors,
  });

  console.log("w", width);

  // let pendingSelections = [];
  console.log("pending slectiosn set");

  // scales, memoize for performance
  const xScale = useMemo(
    () =>
      scaleBand({
        rangeRound: [0, xMax],
        domain: qData.qMatrix.map(getBand),
        padding: 0.4,
      }),
    [xMax]
  );
  const yScale = useMemo(
    () =>
      scaleLinear({
        rangeRound: [yMax, 0],
        domain: [
          Math.min(...qData.qMatrix.map(getValue)),
          Math.max(...qData.qMatrix.map(getValue)),
        ],
        // tickFormat: getValue,
      }),
    [yMax]
  );

  const handleClick = (selectionValue) => {
    // let dim = d;

    // d = d3.select(this).attr("data-parent") || d;

    // if (typeof d !== "object") {
    //   dim = getDimension(d);
    // }

    // if (chartDataShape === "multipleDimensions" && typeof d === "number") {
    //   dim = data[Object.keys(data)[d * categories.length]];
    // } else if (typeof d === "number") {
    //   dim = data[Object.keys(data)[d]];
    // }

    setRefreshChart(false);
    useSelectionColours = true;

    let updateList = [];
    // const selectionValue = args;

    console.log(pendingSelections, selectionValue);

    if (pendingSelections.includes(selectionValue)) {
      updateList = pendingSelections.filter((item) => item != selectionValue);
      // pendingSelections = updateList;
      SetPendingSelections(updateList);
    } else {
      // pendingSelections = [...pendingSelections, selectionValue];
      SetPendingSelections([...pendingSelections, selectionValue]);
    }

    console.log("after", pendingSelections, selectionValue);

    // setBarColors(diagram);

    beginSelections();

    setSelectionBarVisible(true);

    select(0, pendingSelections);
  };

  return width < 10 ? null : (
    <>
      <svg width={width} height={height}>
        <GradientTealBlue id="teal" />
        <rect width={width} height={height} fill="url(#teal)" rx={14} />
        <Group top={verticalMargin / 2}>
          {qData.qMatrix.map((d, i) => {
            const band = getBand(d);
            const barWidth = xScale.bandwidth();
            const barHeight = yMax - yScale(getValue(d));
            const barElemNumber = getElemNumber(d);
            const barX = xScale(band);
            const barY = yMax - barHeight;
            return (
              <Bar
                key={`bar-${band}`}
                qelemnumber={barElemNumber}
                // innerref={i}
                x={barX}
                y={barY}
                width={barWidth}
                height={barHeight}
                // fill="rgba(23, 233, 217, .5)"
                fill={colors[i]}
                // stroke={"red"}
                // strokeWidth={10}
                onClick={() => {
                  if (events)
                    // alert(`clicked: ${JSON.stringify(Object.values(d))}`);
                    // console.log(`clicked: ${JSON.stringify(Object.values(d))}`);
                    handleClick(getElemNumber(d));
                }}
              />
            );
          })}
          <AxisBottom
            top={yMax}
            scale={xScale}
            stroke={axsiColor}
            tickStroke={axsiColor}
            tickLabelProps={() => ({
              fill: axsiColor,
              fontSize: 11,
              textAnchor: "middle",
            })}
          />
          {/* <AxisLeft
            // hideAxisLine
            // hideTicks
            scale={yScale}
            // tickFormat={formatDate}
            // tickFormat={formatDate}
            stroke={axsiColor}
            tickStroke={axsiColor}
            tickLabelProps={() => ({
              fill: axsiColor,
              fontSize: 11,
              textAnchor: "end",
              dy: "0.33em",
            })}
          /> */}
        </Group>
      </svg>
      <div
        style={{
          position: "absolute",
          // top: margin.top / 2 - 10,
          top: 20,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          fontSize: "14px",
        }}
      >
        <LegendOrdinal
          scale={colorScale}
          direction="row"
          labelMargin="0 15px 0 0"
        />
      </div>
    </>
  );
}
