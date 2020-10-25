import React, { useContext, useCallback } from "react";
import LinePath from "@visx/shape/lib/shapes/LinePath";
import { AxisScale } from "@visx/axis";
import DataContext from "../../../context/DataContext";
import { SeriesProps } from "../../../types";
import withRegisteredData, {
  WithRegisteredDataProps,
} from "../../../enhancers/withRegisteredData";
import getScaledValueFactory from "../../../utils/getScaledValueFactory";
import useEventEmitter, { HandlerParams } from "../../../hooks/useEventEmitter";
import findNearestDatumX from "../../../utils/findNearestDatumX";
import TooltipContext from "../../../context/TooltipContext";
import findNearestDatumY from "../../../utils/findNearestDatumY";
import { localPoint } from "@visx/event";

export type BaseLineSeriesProps<
  XScale extends AxisScale,
  YScale extends AxisScale,
  Datum extends object
> = SeriesProps<XScale, YScale, Datum> & {
  /** Whether line should be rendered horizontally instead of vertically. */
  horizontal?: boolean;
  /** Rendered component which is passed path props by BaseLineSeries after processing. */
  PathComponent?:
    | React.FC<Omit<React.SVGProps<SVGPathElement>, "ref">>
    | "path";
} & Omit<
    React.SVGProps<SVGPathElement>,
    "x" | "y" | "x0" | "x1" | "y0" | "y1" | "ref"
  >;

function BaseLineSeries<
  XScale extends AxisScale,
  YScale extends AxisScale,
  Datum extends object
>({
  data,
  dataKey,
  xAccessor,
  xScale,
  yAccessor,
  yScale,
  elAccessor,
  horizontal,
  PathComponent = "path",
  ...lineProps
}: BaseLineSeriesProps<XScale, YScale, Datum> &
  WithRegisteredDataProps<XScale, YScale, Datum>) {
  const {
    colorScale,
    theme,
    width,
    height,
    currentSelectionIds,
    handleClick,
  } = useContext(DataContext);
  const { showTooltip, hideTooltip } = useContext(TooltipContext) ?? {};
  const getScaledX = useCallback(getScaledValueFactory(xScale, xAccessor), [
    xScale,
    xAccessor,
  ]);
  const getScaledY = useCallback(
    getScaledValueFactory(yScale, yAccessor, dataKey),
    [yScale, yAccessor]
  );
  const color = colorScale?.(dataKey) ?? theme?.colors?.[0] ?? "#222";

  const handleMouseMove = useCallback(
    (params?: HandlerParams) => {
      const { svgPoint } = params || {};
      if (svgPoint && width && height && showTooltip) {
        const datum = (horizontal ? findNearestDatumY : findNearestDatumX)({
          point: svgPoint,
          data,
          xScale,
          yScale,
          xAccessor,
          yAccessor,
          width,
          height,
        });
        if (datum) {
          showTooltip({
            key: dataKey,
            ...datum,
            svgPoint,
          });
        }
      }
    },
    [
      dataKey,
      data,
      xScale,
      yScale,
      xAccessor,
      yAccessor,
      width,
      height,
      showTooltip,
      horizontal,
    ]
  );

  useEventEmitter("mousemove", handleMouseMove);
  useEventEmitter("mouseout", hideTooltip);

  const onClick = (event: MouseEvent) => {
    const { x: svgMouseX, y: svgMouseY } = localPoint(event) || {};
    const svgPoint = { x: svgMouseX, y: svgMouseY };
    if (svgPoint && width && height) {
      const datum = (horizontal ? findNearestDatumY : findNearestDatumX)({
        point: svgPoint,
        data,
        xScale,
        yScale,
        xAccessor,
        yAccessor,
        width,
        height,
      });

      if (datum) {
        const selectionId = Number(elAccessor(datum.datum));

        const selections = currentSelectionIds.includes(selectionId)
          ? currentSelectionIds.filter(function(value: number, index, arr) {
              return value !== selectionId;
            })
          : [...currentSelectionIds, selectionId];
        handleClick(selections);
      }
    }
  };

  const onMouseMove = (event: MouseEvent) => {
    const { x: svgMouseX, y: svgMouseY } = localPoint(event) || {};
    const svgPoint = { x: svgMouseX, y: svgMouseY };
    if (svgPoint && width && height && showTooltip) {
      const datum = (horizontal ? findNearestDatumY : findNearestDatumX)({
        point: svgPoint,
        data,
        xScale,
        yScale,
        xAccessor,
        yAccessor,
        width,
        height,
      });
      if (datum) {
        showTooltip({
          key: dataKey,
          ...datum,
          svgPoint,
        });
      }
    }
  };

  const onMouseLeave = () => {
    hideTooltip();
  };

  return (
    <LinePath
      data={data}
      x={getScaledX}
      y={getScaledY}
      stroke={color}
      strokeWidth={2}
      {...lineProps}
    >
      {({ path }) => (
        <PathComponent
          stroke={color}
          strokeWidth={2}
          fill="transparent"
          onClick={onClick}
          onMouseMove={onMouseMove}
          onMouseLeave={onMouseLeave}
          {...lineProps}
          d={path(data) || ""}
        />
      )}
    </LinePath>
  );
}

export default withRegisteredData(BaseLineSeries);
