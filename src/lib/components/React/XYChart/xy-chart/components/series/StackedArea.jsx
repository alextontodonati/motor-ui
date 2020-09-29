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
import TooltipContext from "../../context/TooltipContext";
import { selectColor } from "../../../../../../utils/colors";

export default function Stack({ children }) {
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
    handleClick,
    findNearestData,
    currentSelectionIds,
    // selectionIds,
  } = useContext(ChartContext) || {};

  const { showTooltip, hideTooltip } = useContext(TooltipContext) || {};

  // extract data keys from child series
  const dataKeys = useMemo(
    () => React.Children.map(children, (child) => child.props.dataKey),
    [children]
  );

  // use a ref to the stacks for mouse movements
  const stacks = useRef(null);

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
        const stack = xAccessor(d);
        const stackKey = String(stack);
        if (!dataByStackValue[stackKey]) {
          dataByStackValue[stackKey] = {
            stack,
            positiveSum: 0,
            negativeSum: 0,
          };
        }
        const value = yAccessor(d);
        dataByStackValue[stackKey][dataKey] = value;
        dataByStackValue[stackKey]["selectionId"] = elAccessor(d);
        dataByStackValue[stackKey][
          value >= 0 ? "positiveSum" : "negativeSum"
        ] += value;
      });
    });

    return Object.values(dataByStackValue);
  }, [children]);

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
      };

      // only need to update the domain for one of the keys
      if (comprehensiveDomain.length > 0 && dataKeys.indexOf(key) === 0) {
        dataToRegister[key].yScale = (scale) =>
          scale.domain(
            extent([...scale.domain(), ...comprehensiveDomain], (d) => d)
          );
      }
    });

    registerData(dataToRegister);

    // unregister data on unmount
    return () => unregisterData(Object.keys(dataToRegister));
  }, [comprehensiveDomain, registerData, unregisterData, children, dataKeys]);

  // if scales and data are not available in the registry, bail

  const onMouseMove = useCallback(
    (event) => {
      const nearestData = findNearestData(event);
      if (nearestData.closestDatum && showTooltip) {
        showTooltip({
          tooltipData: {
            ...nearestData,
          },
        });
      }
    },
    [findNearestData, showTooltip]
  );

  const onClick = (event) => {
    const nearestData = findNearestData(event);
    const selectionId = nearestData.closestDatum.datum[0].qElemNumber;
    const selections = currentSelectionIds.includes(selectionId)
      ? currentSelectionIds.filter(function(value) {
          return value !== selectionId;
        })
      : [...currentSelectionIds, selectionId];
    handleClick(selections);
  };

  const hasSomeNegativeValues = comprehensiveDomain.some((num) => num < 0);

  if (
    dataKeys.some((key) => dataRegistry[key] == null) ||
    !xScale ||
    !yScale ||
    !colorScale
  ) {
    return null;
  }
  // console.log(theme);

  // const { valueLabelStyles, stackedArea } = theme;

  // const labelProps = {
  //   ...valueLabelStyles,
  //   fontSize: valueLabelStyles.fontSize[size],
  //   ...valueLabelStyle,
  // };

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
          // !path(stack).includes("MNaN") ? (
          <path
            key={`stack-${stack.key}`}
            d={path(stack) || ""}
            fill={color(stack.key, i)}
            // stroke={stackedArea.stroke}
            // strokeWidth={stackedArea.strokeWidth}
            stroke={selectColor(theme?.stackedArea.stroke, theme) ?? "white"}
            strokeWidth={
              selectColor(theme?.stackedArea.strokeWidth, theme) ?? 1
            }
            onClick={onClick}
            onMouseMove={onMouseMove}
            onMouseLeave={() => {
              hideTooltip();
            }}
          />
        ))
      }
    </AreaStack>
  );
}
