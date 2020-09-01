import React, { useContext, useCallback } from "react";
import { animated, useSpring } from "react-spring";
import LinePath from "@vx/shape/lib/shapes/LinePath";
import ChartContext from "../../context/ChartContext";
import withRegisteredData from "../../enhancers/withRegisteredData";
import isValidNumber from "../../typeguards/isValidNumber";
import useRegisteredData from "../../hooks/useRegisteredData";
// import { callOrValue, isDefined } from "../../util/chartUtils";

// import { GlyphCircle } from "@vx/glyph";
import {
  Glyph as CustomGlyph,
  GlyphCircle,
  GlyphCross,
  GlyphDiamond,
  GlyphSquare,
  GlyphStar,
  GlyphTriangle,
  GlyphWye,
} from "@vx/glyph";

const ChartGlyph = GlyphCircle;

function LineSeries({
  data: _,
  xAccessor: __,
  yAccessor: ___,
  dataKey,
  mouseEvents,
  horizontal = false,
  ...lineProps
}) {
  const { xScale, yScale, colorScale, showPoints } = useContext(ChartContext);
  const { data, xAccessor, yAccessor } = useRegisteredData(dataKey) || {};

  const getScaledX = useCallback(
    (d) => {
      const x = xScale(xAccessor?.(d));
      return isValidNumber(x) ? x + (xScale.bandwidth?.() ?? 0) / 2 : null;
    },
    [xScale, xAccessor]
  );

  const getScaledY = useCallback(
    (d) => {
      const y = yScale(yAccessor?.(d));
      return isValidNumber(y) ? y + (yScale.bandwidth?.() ?? 0) / 2 : null;
    },
    [yScale, yAccessor]
  );

  if (!data || !xAccessor || !yAccessor) return null;

  const color = colorScale(dataKey) ?? "#222";

  // const primaryColor = "#8921e0";
  // const secondaryColor = "#00f2ff";
  // const contrastColor = "#ffffff";
  // const showLabels = true;

  return (
    <g className="vx-group line-series">
      <LinePath data={data} x={getScaledX} y={getScaledY} {...lineProps}>
        {({ path }) => (
          <AnimatedPath stroke={color} {...lineProps} d={path(data) || ""} />
        )}
      </LinePath>

      {showPoints &&
        data.map((d, i) => {
          const left = getScaledX(d);
          const top = getScaledY(d);
          return (
            <g key={`line-glyph-${i}`}>
              <ChartGlyph
                left={left}
                top={top}
                size={110}
                // fill={i % 2 === 0 ? primaryColor : contrastColor}
                // stroke={i % 2 === 0 ? contrastColor : primaryColor}
                fill={color}
                stroke={color}
                strokeWidth={2}
              />
              {/* {d[0].qText && (
                <text
                  // x={xScale(x(d))}
                  // y={yScale(y(d))}
                  left={left}
                  top={top}
                  dx={10}
                  // fill={d.stroke || callOrValue(stroke, d, i)}
                  fill={color}
                  stroke="#fff"
                  strokeWidth={1}
                  fontSize={12}
                >
                  {d[0].qText}
                </text>
              )} */}
            </g>
          );
        })}
    </g>
  );
}

/** Separate component so that we don't use the `useSpring` hook in a render function callback. */
function AnimatedPath({ d, ...lineProps }) {
  const tweenedPath = useSpring({ d, config: { precision: 0.01 } });
  return <animated.path d={tweenedPath.d} fill="transparent" {...lineProps} />;
}

export default React.memo(
  withRegisteredData(LineSeries, {
    legendShape: ({ strokeDasharray }) =>
      strokeDasharray ? "dashed-line" : "line",
  })
);
