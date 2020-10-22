import React, { useContext } from "react";
import { TooltipWithBounds } from "@visx/tooltip";
import { timeParse, timeFormat } from "d3-time-format";

import TooltipContext from "../../context/TooltipContext";
import ChartContext from "../../context/ChartContext";
import { isNull, selectColor } from "../../../../utils";

export default function Tooltip(
  {
    // snapToDataX,
    // snapToDataY,
    // showClosestItem,
    // useSingleColor,
    // valueOnly,
    // valueWithText,
  }
) {
  const { tooltipData } = useContext(TooltipContext) || {};

  const {
    theme,
    formatValue,
    size,
    formatTooltipDate,
    parseDateFormat,
    tooltipStyles,
  } = useContext(ChartContext) || {};

  const parseDate = timeParse(parseDateFormat);
  const formatDate = timeFormat(formatTooltipDate);
  const dateFormatter = (date) => formatDate(parseDate(date));

  // early return if there's no tooltip
  const { svgMouseX, svgMouseY, colorScale } = tooltipData || {};

  if (svgMouseX == null || svgMouseY == null) return null;

  const xCoord = svgMouseX;

  const yCoord = svgMouseY;

  function renderTooltip({ label, value, percent, colorScale }) {
    const color = colorScale(`${label}`);

    return (
      <>
        <div>
          <strong style={{ color }}>{label} </strong>
          {formatValue(value)}
        </div>
      </>
    );
  }

  return (
    <TooltipWithBounds
      left={svgMouseX}
      top={svgMouseY}
      style={{
        ...theme?.tooltip?.tooltipStyles,
        fontSize: theme?.tooltip?.tooltipStyles?.fontSize[size],
        background:
          selectColor(theme?.tooltip?.tooltipStyles?.backgroundColor, theme) ??
          "white",
        color:
          selectColor(theme?.tooltip?.tooltipStyles?.color, theme) ?? "#222",
        ...tooltipStyles,
      }}
    >
      {renderTooltip({ ...tooltipData, colorScale })}
    </TooltipWithBounds>
  );
}
