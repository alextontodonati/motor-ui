import React, { useContext, useMemo, useEffect } from "react";
import BarGroup from "@vx/shape/lib/shapes/BarGroup";
import BarGroupHorizontal from "@vx/shape/lib/shapes/BarGroupHorizontal";
import { Group as VxGroup } from "@vx/group";
import { scaleBand } from "@vx/scale";
import ChartContext from "../../context/ChartContext";

import findNearestDatumX from "../../util/findNearestDatumX";
import findNearestDatumY from "../../util/findNearestDatumY";
import AnimatedBars from "./AnimatedBars";
import AnimatedText from "./AnimatedText";

const GROUP_ACCESSOR = (d) => d.group;

// @TODO add GroupKeys type
export default function Group({ horizontal, children, ...rectProps }) {
  const {
    width,
    height,
    margin,
    xScale,
    yScale,
    colorScale,
    dataRegistry,
    registerData,
    unregisterData,
  } = useContext(ChartContext);

  // extract data keys from child series
  const dataKeys = useMemo(
    () => React.Children.map(children, (child) => child.props.dataKey),
    [children]
  );

  //
  const groupScale = useMemo(
    () =>
      scaleBand({
        domain: [...dataKeys],
        range: [0, (horizontal ? yScale : xScale)?.bandwidth?.()],
        padding: 0.1,
      }),
    [dataKeys, xScale, yScale, horizontal]
  );

  // @todo, this should be refactored such that it can be memoized.
  // currently it references groupScale which depends on xScale, yScale,
  // and thus causes an infinite loop for updating the data registry.
  const findNearestDatum = (args) => {
    const nearestDatum = horizontal
      ? findNearestDatumY(args)
      : findNearestDatumX(args);

    if (!nearestDatum) return null;

    const distanceX = horizontal
      ? nearestDatum.distanceX
      : Math.abs(
          args.svgMouseX -
            (args.xScale(args.xAccessor(nearestDatum.datum)) +
              groupScale(args.key) +
              groupScale.bandwidth() / 2)
        );

    const distanceY = horizontal
      ? Math.abs(
          args.svgMouseY -
            (args.yScale(args.yAccessor(nearestDatum.datum)) +
              groupScale(args.key) +
              groupScale.bandwidth() / 2)
        )
      : nearestDatum.distanceY;

    return {
      ...nearestDatum,
      distanceX,
      distanceY,
    };
  };

  useEffect(
    // register all child data
    () => {
      const dataToRegister = {};

      React.Children.map(children, (child) => {
        const {
          dataKey: key,
          data,
          xAccessor,
          yAccessor,
          mouseEvents,
        } = child.props;
        dataToRegister[key] = {
          key,
          data,
          xAccessor,
          yAccessor,
          mouseEvents,
          findNearestDatum,
        };
      });

      registerData(dataToRegister);
      return () => unregisterData(Object.keys(dataToRegister));
    },
    // @TODO fix findNearestDatum
    // can't include findNearestDatum as it depends on groupScale which depends
    // on the registry so will cause an infinite loop.
    [registerData, unregisterData, children]
  );

  // merge all child data by x value
  const combinedData = useMemo(() => {
    const dataByGroupValue = {};
    dataKeys.forEach((key) => {
      const { data = [], xAccessor, yAccessor } = dataRegistry[key] || {};

      // this should exist but double check
      if (!xAccessor || !yAccessor) return;

      data.forEach((d) => {
        const group = (horizontal ? yAccessor : xAccessor)(d);
        const groupKey = String(group);
        if (!dataByGroupValue[groupKey]) dataByGroupValue[groupKey] = { group };
        dataByGroupValue[groupKey][key] = (horizontal ? xAccessor : yAccessor)(
          d
        );
      });
    });
    return Object.values(dataByGroupValue);
  }, [horizontal, dataKeys, dataRegistry]);

  // if scales and data are not available in the registry, bail
  if (
    dataKeys.some((key) => dataRegistry[key] == null) ||
    !xScale ||
    !yScale ||
    !colorScale
  ) {
    return null;
  }

  // @TODO handle NaNs from non-number inputs, prob fallback to 0
  // @TODO should consider refactoring base shapes to handle negative values better
  const scaledZeroPosition = (horizontal ? xScale : yScale)(0);

  return horizontal ? (
    <BarGroupHorizontal
      data={combinedData}
      keys={dataKeys}
      width={width - margin.left - margin.right} // this is unused, should be removed in component
      x={(xValue) => xScale(xValue)}
      y0={GROUP_ACCESSOR}
      y0Scale={yScale} // group position
      y1Scale={groupScale}
      xScale={xScale}
      color={colorScale}
    >
      {(barGroups) =>
        barGroups.map((barGroup) => (
          // @TODO if we use <animated.g /> we might be able to make this animate on first render
          <VxGroup
            key={`bar-group-${barGroup.index}-${barGroup.y0}`}
            top={barGroup.y0}
          >
            <AnimatedBars
              bars={barGroup.bars}
              x={(bar) => Math.min(scaledZeroPosition, bar.x)}
              y={(bar) => bar.y}
              width={(bar) => Math.abs(bar.width - scaledZeroPosition)}
              height={(bar) => bar.height}
              rx={2}
              {...rectProps}
            />
          </VxGroup>
        ))
      }
    </BarGroupHorizontal>
  ) : (
    <BarGroup
      data={combinedData}
      keys={dataKeys}
      height={height - margin.top - margin.bottom} // BarGroup should figure this out from yScale
      x0={GROUP_ACCESSOR}
      x0Scale={xScale} // group position
      x1Scale={groupScale}
      yScale={yScale}
      color={(dataKey) => colorScale(dataKey)}
    >
      {(barGroups) =>
        barGroups.map((barGroup) => (
          <VxGroup
            key={`bar-group-${barGroup.index}-${barGroup.x0}`}
            left={barGroup.x0}
          >
            <AnimatedBars
              bars={barGroup.bars}
              x={(bar) => bar.x}
              y={(bar) => Math.min(scaledZeroPosition, bar.y)}
              width={(bar) => bar.width}
              height={(bar) => Math.abs(scaledZeroPosition - bar.y)}
              rx={2}
              {...rectProps}
            />
            {/* <GroupLabels barGroup={barGroup} bars={barGroup.bars} /> */}
            <AnimatedText
              bars={barGroup.bars}
              x={(bar) => bar.x}
              y={(bar) => Math.min(scaledZeroPosition, bar.y)}
              width={(bar) => bar.width}
              height={(bar) => Math.abs(scaledZeroPosition - bar.y)}
              rx={2}
              {...rectProps}
            />
          </VxGroup>
        ))
      }
    </BarGroup>
  );
}
