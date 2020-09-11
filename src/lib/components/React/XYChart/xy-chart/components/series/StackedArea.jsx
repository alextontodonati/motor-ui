import React, {
  useContext,
  useMemo,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { extent } from "d3-array";
import AreaStack from "./AreaStack";
import ChartContext from "../../context/ChartContext";

import findNearestDatumY from "../../util/findNearestDatumY";
import findNearestDatumX from "../../util/findNearestDatumX";

export default function Stack({ horizontal, children, ...rectProps }) {
  const {
    xScale,
    yScale,
    colorScale,
    dataRegistry,
    registerData,
    unregisterData,
    height,
    margin,
    theme,
    // handleClick,
    // currentSeelctionIds,
    // selectionIds,
  } = useContext(ChartContext) || {};

  // extract data keys from child series
  const dataKeys = useMemo(
    () => React.Children.map(children, (child) => child.props.dataKey),
    [children]
  );

  // use a ref to the stacks for mouse movements
  const stacks = useRef(null);

  // override the findNearestDatum logic
  const findNearestDatum = useCallback(
    (args) => {
      if (!stacks.current) return null;

      const nearestDatum = horizontal
        ? findNearestDatumY(args)
        : findNearestDatumX(args);

      if (!nearestDatum) return null;

      // find the stack for this key, and the bar in that stack corresponding to nearestDatum
      const stack = stacks.current.find(
        (currStack) => currStack.key === args.key
      );
      const bar = stack?.bars?.[nearestDatum.index];

      if (!bar) return null;

      const distanceX = horizontal
        ? // if svgMouseX is *on* the bar, set distance to 0
          args.svgMouseX >= bar.x && args.svgMouseX <= bar.x + bar.width
          ? 0
          : // otherwise take the min distance between the left and the right of the bar
            Math.min(
              Math.abs(args.svgMouseX - bar.x),
              Math.abs(args.svgMouseX - (bar.x + bar.width))
            )
        : nearestDatum.distanceX;

      const distanceY = horizontal
        ? nearestDatum.distanceY
        : // if svgMouseY is *on* the bar, set distance to 0
        args.svgMouseY >= bar.y && args.svgMouseY <= bar.y + bar.height
        ? 0
        : // otherwise take the min distance between the top and the bottom of the bar
          Math.min(
            Math.abs(args.svgMouseY - bar.y),
            Math.abs(args.svgMouseY - (bar.y + bar.height))
          );

      return {
        ...nearestDatum,
        distanceX,
        distanceY,
      };
    },
    [horizontal]
  );

  // group all child data by stack value, this format is needed by BarStack
  const combinedData = useMemo(() => {
    const dataByStackValue = {};
    React.Children.forEach(children, (child) => {
      const {
        dataKey,
        data = [],
        xAccessor,
        yAccessor,
        elAccessor,
      } = child.props;

      // this should exist but double check
      if (!xAccessor || !yAccessor || !elAccessor) return;

      data.forEach((d) => {
        const stack = (horizontal ? yAccessor : xAccessor)(d);
        const stackKey = String(stack);
        if (!dataByStackValue[stackKey]) {
          dataByStackValue[stackKey] = {
            stack,
            positiveSum: 0,
            negativeSum: 0,
          };
        }
        const value = (horizontal ? xAccessor : yAccessor)(d);
        dataByStackValue[stackKey][dataKey] = value;
        dataByStackValue[stackKey]["selectionId"] = elAccessor(d);
        dataByStackValue[stackKey][
          value >= 0 ? "positiveSum" : "negativeSum"
        ] += value;
      });
    });

    return Object.values(dataByStackValue);
  }, [horizontal, children]);

  // update the domain to account for the (directional) stacked value
  const comprehensiveDomain = useMemo(
    () =>
      extent(
        combinedData
          .map((d) => d.positiveSum)
          .concat(combinedData.map((d) => d.negativeSum)),
        (d) => d
      ).filter((val) => val != null),
    [combinedData]
  );

  // register all child data
  useEffect(() => {
    const dataToRegister = {};

    React.Children.map(children, (child) => {
      const {
        dataKey: key,
        data,
        xAccessor,
        yAccessor,
        elAccessor,
        mouseEvents,
      } = child.props;
      dataToRegister[key] = {
        key,
        data,
        xAccessor,
        yAccessor,
        elAccessor,
        mouseEvents,
        findNearestDatum,
      };

      // only need to update the domain for one of the keys
      if (comprehensiveDomain.length > 0 && dataKeys.indexOf(key) === 0) {
        if (horizontal) {
          dataToRegister[key].xScale = (scale) =>
            scale.domain(
              extent([...scale.domain(), ...comprehensiveDomain], (d) => d)
            );
        } else {
          dataToRegister[key].yScale = (scale) =>
            scale.domain(
              extent([...scale.domain(), ...comprehensiveDomain], (d) => d)
            );
        }
      }
    });

    registerData(dataToRegister);

    // unregister data on unmount
    return () => unregisterData(Object.keys(dataToRegister));
  }, [
    horizontal,
    comprehensiveDomain,
    registerData,
    unregisterData,
    children,
    findNearestDatum,
    dataKeys,
  ]);

  // if scales and data are not available in the registry, bail
  if (
    dataKeys.some((key) => dataRegistry[key] == null) ||
    !xScale ||
    !yScale ||
    !colorScale
  ) {
    return null;
  }

  const hasSomeNegativeValues = comprehensiveDomain.some((num) => num < 0);

  return (
    // @TODO types
    <AreaStack
      top={margin.top}
      left={margin.left}
      data={combinedData}
      keys={dataKeys}
      x={(d) => xScale(d.data.stack)}
      y0={(d) => yScale(d[0])}
      y1={(d) => yScale(d[1])}
      offset={hasSomeNegativeValues ? "diverging" : undefined}
      color={colorScale}
    >
      {({ stacks, path, color }) =>
        stacks.map((stack, i) => (
          <path
            key={`stack-${stack.key}`}
            d={path(stack) || ""}
            stroke="transparent"
            // fill="url(#stacked-area-orangered)"
            // fill="url(#stacked-area-orangered)"
            fill={color(stack.key, i)}
            stroke="#fff"
            // fillOpacity={0.7}
            // strokeWidth={1}
            // curve={
            //   "linear"
            //   // interpolatorLookup[interpolation] || interpolatorLookup.monotoneX
            // }
            onClick={() => {
              if (events) alert(`${stack.key}`);
            }}
          />
        ))
      }
    </AreaStack>
  );
}
