import React from "react";
import cx from "classnames";
// import Stack from './Stack';
import Stack from "@vx/shape";

export default function AreaStack({
  className,
  top,
  left,
  keys,
  data,
  curve,
  defined,
  x,
  x0,
  x1,
  y0,
  y1,
  value,
  order,
  offset,
  color,
  children,
  ...restProps
}) {
  return (
    <Stack
      className={className}
      top={top}
      left={left}
      keys={keys}
      data={data}
      curve={curve}
      defined={defined}
      x={x}
      x0={x0}
      x1={x1}
      y0={y0}
      y1={y1}
      value={value}
      order={order}
      offset={offset}
      color={color}
      {...restProps}
    >
      {children ||
        (({ stacks, path }) =>
          stacks.map((series, i) => (
            <path
              className={cx("vx-area-stack", className)}
              key={`area-stack-${i}-${series.key || ""}`}
              d={path(series) || ""}
              fill={color?.(series.key, i)}
              {...restProps}
            />
          )))}
    </Stack>
  );
}
