import React from "react";
import { AreaStack } from "@vx/shape";
import { GradientOrangeRed } from "@vx/gradient";
import browserUsage from "@vx/mock-data/lib/mocks/browserUsage";
import { scaleTime, scaleLinear } from "@vx/scale";
import { timeParse } from "d3-time-format";

const data = browserUsage;
const keys = Object.keys(data[0]).filter((k) => k !== "date");
const parseDate = timeParse("%Y %b %d");
export const background = "#f38181";

const getDate = (d) => parseDate(d.date).valueOf();
const getY0 = (d) => d[0] / 100;
const getY1 = (d) => d[1] / 100;

export default function Example({
  width,
  height,
  margin = { top: 0, right: 0, bottom: 0, left: 0 },
  events = false,
}) {
  // bounds
  const yMax = height - margin.top - margin.bottom;
  const xMax = width - margin.left - margin.right;

  // scales
  const xScale = scaleTime({
    range: [0, xMax],
    domain: [Math.min(...data.map(getDate)), Math.max(...data.map(getDate))],
  });
  const yScale = scaleLinear({
    range: [yMax, 0],
  });

  return width < 10 ? null : (
    <svg width={width} height={height}>
      <GradientOrangeRed id="stacked-area-orangered" />
      <rect
        x={0}
        y={0}
        width={width}
        height={height}
        fill={background}
        rx={14}
      />
      <AreaStack
        top={margin.top}
        left={margin.left}
        keys={keys}
        data={data}
        x={(d) => xScale(getDate(d.data))}
        y0={(d) => yScale(getY0(d))}
        y1={(d) => yScale(getY1(d))}
      >
        {({ stacks, path }) =>
          stacks.map((stack) => (
            <path
              key={`stack-${stack.key}`}
              d={path(stack) || ""}
              stroke="transparent"
              fill="url(#stacked-area-orangered)"
              onClick={() => {
                if (events) alert(`${stack.key}`);
              }}
            />
          ))
        }
      </AreaStack>
    </svg>
  );
}
