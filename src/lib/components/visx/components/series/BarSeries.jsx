import React, { useContext, useCallback, useMemo } from "react";
import { Text } from "@visx/text";
import ChartContext from "../../context/ChartContext";
import withRegisteredData from "../../enhancers/withRegisteredData";
import { isValidNumber } from "../../utils/chartUtils";
import useRegisteredData from "../../../../hooks/useRegisteredData";
import findNearestDatumX from "../../utils/findNearestDatumX";
import findNearestDatumY from "../../utils/findNearestDatumY";
import findNearestDatumComboXY from "../../utils/findNearestDatumComboXY";
import AnimatedBars from "./AnimatedBars";
import { selectColor } from "../../../../utils";

function BarSeries({
  dataKey,
  dataKeys,
  data: _,
  xAccessor: __,
  yAccessor: ___,
  elAccessor: ____,
  mouseEvents,
  horizontal,
  isCombo = false,
  barThickness: barThicknessProp,
  ...barProps
}) {
  const {
    theme,
    colorScale,
    xScale,
    yScale,
    // isContinuousAxes,
    showLabels,
    formatValue,
    valueLabelStyle,
    size,
    multiColor,
  } = useContext(ChartContext);

  const { data, xAccessor, yAccessor, elAccessor } = useRegisteredData(dataKey);

  const getScaledX = useCallback((d) => xScale(xAccessor(d)), [
    xScale,
    xAccessor,
  ]);

  const getScaledY = useCallback((d) => yScale(yAccessor(d)), [
    yScale,
    yAccessor,
  ]);

  const getValue = useCallback((d) => yAccessor(d), [yScale, yAccessor]);

  const getElemNumber = useCallback((d) => elAccessor(d), [elAccessor]);

  const { valueLabelStyles } = theme;

  const labelProps = {
    ...valueLabelStyles,
    fontSize: valueLabelStyles.fontSize[size],
    ...valueLabelStyle,
  };

  const renderLabel = ({ datum, labelProps }) =>
    datum.label ? (
      <Text {...labelProps}>{formatValue(datum.label)}</Text>
    ) : null;

  const [xMin, xMax] = xScale.range();
  const [yMax, yMin] = yScale.range();
  const innerWidth = Math.abs(xMax - xMin);
  const innerHeight = Math.abs(yMax - yMin);
  const barThickness =
    barThicknessProp ||
    (horizontal
      ? // non-bandwidth estimate assumes no missing data values
        yScale.bandwidth?.() ?? innerHeight / data.length
      : xScale.bandwidth?.() ?? innerWidth / data.length);

  // try to figure out the 0 baseline for correct rendering of negative values
  // we aren't sure if these are numeric scales or not a priori
  // @ts-ignore
  const maybeXZero = xScale(0);
  // @ts-ignore
  const maybeYZero = yScale(0);

  const xZeroPosition = isValidNumber(maybeXZero)
    ? // if maybeXZero _is_ a number, but the scale is not clamped and it's outside the domain
      // fallback to the scale's minimum
      Math.max(maybeXZero, Math.min(xMin, xMax))
    : Math.min(xMin, xMax);
  const yZeroPosition = isValidNumber(maybeYZero)
    ? Math.min(maybeYZero, Math.max(yMin, yMax))
    : Math.max(yMin, yMax);

  const x = (d) => d[0].qText;
  // const x = (d) => (isContinuousAxes ? d[0].qNum : d[0].qText);
  const y = (d) => (horizontal ? d[0].qText : d[1].qNum);

  const categoryScale = horizontal ? yScale : xScale;
  const valueScale = horizontal ? xScale : yScale;
  const categoryField = horizontal ? y : x;
  const Labels = []; // Labels on top

  const bars = useMemo(
    () =>
      data.map((datum, i) => {
        const x = getScaledX(datum);
        const y = getScaledY(datum);
        const selectionId = getElemNumber(datum);

        const categoryOffset = categoryScale.offset || 0;

        const barPosition =
          categoryScale(categoryField(datum)) - categoryOffset;

        const barLength = horizontal ? x - xZeroPosition : y - yZeroPosition;

        const barWidth =
          categoryScale.barWidth ||
          (categoryScale.bandwidth && categoryScale.bandwidth()) ||
          0;

        const minValue = Math.min(...valueScale.domain());

        const barColor = colorScale(
          dataKeys ? (multiColor ? dataKeys[i] : dataKeys[0]) : dataKey
        );

        const minPosition = valueScale(minValue < 0 ? 0 : minValue);

        const key = `bar-${barPosition}`;
        // datum.label = datum[1].qNum;
        datum.label = getValue(datum);
        // console.log(getValue(datum));

        if (renderLabel && showLabels) {
          const Label = renderLabel({
            datum,
            index: i,
            labelProps: {
              key,
              ...labelProps,
              x: horizontal
                ? // ? minPosition + Math.abs(barLength)
                  minPosition + Math.max(0, barLength)
                : barPosition + barWidth / 2,
              y: horizontal
                ? barPosition + barWidth / 2
                : minPosition + Math.min(0, barLength),

              dx: horizontal ? "0.5em" : 0,
              dy: horizontal ? 0 : "-0.74em",
              textAnchor: horizontal ? "start" : "middle",
              verticalAnchor: horizontal ? "middle" : "end",
              width: horizontal ? null : barWidth,
            },
          });

          if (Label) Labels.push(Label);
        }

        return {
          x: horizontal ? xZeroPosition + Math.min(0, barLength) : x,
          y: horizontal ? y : yZeroPosition + Math.min(0, barLength),
          width: horizontal ? Math.abs(barLength) : barThickness,
          height: horizontal ? barThickness : Math.abs(barLength),
          selectionId,
          color: barColor,
        };
      }),
    [
      horizontal,
      // barColor,
      barThickness,
      data,
      xZeroPosition,
      yZeroPosition,
      getScaledX,
      getScaledY,
      // selectionIds,
    ]
  );

  return (
    <g className="visx-chart bar-series">
      <AnimatedBars
        bars={bars}
        stroke={selectColor(theme?.bar.stroke, theme) ?? "white"}
        strokeWidth={theme?.bar.strokeWidth ?? 1}
        {...barProps}
      />
      {Labels.map((Label) => Label)}
    </g>
  );
}

export default withRegisteredData(BarSeries, {
  legendShape: () => "rect",
  findNearestDatum: ({ horizontal, isCombo }) =>
    // horizontal ? findNearestDatumY : findNearestDatumX,
    horizontal
      ? findNearestDatumY
      : isCombo
      ? findNearestDatumComboXY
      : findNearestDatumX,
});
