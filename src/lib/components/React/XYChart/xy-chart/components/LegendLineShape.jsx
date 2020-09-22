// @TODO move this to @visx/legend
import React from "react";
import { Group } from "@visx/group";

export default function ShapeLine({ fill, width, height, style }) {
  const cleanHeight =
    typeof height === "string" || typeof height === "undefined" ? 0 : height;
  const lineThickness = Number(style?.strokeWidth ?? 2);
  return (
    <svg width={width} height={height}>
      <Group top={cleanHeight / 2 - lineThickness / 2}>
        <line
          x1={0}
          x2={width}
          y1={0}
          y2={0}
          stroke={fill}
          strokeWidth={lineThickness}
          style={style}
        />
      </Group>
    </svg>
  );
}
