import React from "react";
import PropTypes from "prop-types";
import XYChart from "../XYChart";

function Area({ cols, stacked, ...rest }) {
  return (
    <XYChart // width={750} height={400}  events={true}
      type={cols.length !== 2 && stacked ? "areastack" : "area"}
      cols={cols}
      {...rest}
    />
  );
}

const BORDER_SHAPE = PropTypes.shape({
  color: PropTypes.oneOfType([PropTypes.string]),
  side: PropTypes.oneOf([
    "top",
    "left",
    "bottom",
    "right",
    "start",
    "end",
    "horizontal",
    "vertical",
    "all",
    "between",
  ]),
  size: PropTypes.oneOfType([PropTypes.string]),
  style: PropTypes.oneOf([
    "solid",
    "dashed",
    "dotted",
    "double",
    "groove",
    "ridge",
    "inset",
    "outset",
    "hidden",
  ]),
});

Area.propTypes = {
  /** cols from Qlik Data Model to render in the Area  */
  cols: PropTypes.array.isRequired,
  /** Calc condition for the chart  */
  calcCondition: PropTypes.shape({
    qCond: PropTypes.string,
    qMsg: PropTypes.string,
  }),
  /** Supress zero values in the the chart  */
  suppressZero: PropTypes.bool,
  /** Supress missing values in the the chart  */
  suppressMissing: PropTypes.bool,
  /** Area Sort Order */
  sortOrder: PropTypes.array,
  /** Sort Ascending or descending */
  sortDirection: PropTypes.string,
  /** Area width */
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /** The height of the Area */
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /** The amount of margin around the component */
  margin: PropTypes.string,
  /** The amount of margin around the chart */
  chartMargin: PropTypes.object,
  /** Size of the Area */
  size: PropTypes.oneOf(["tiny", "small", "medium", "large", "xlarge"]),
  // showLabels: PropTypes.oneOf(["top", "none", "inside"]),
  showLabels: PropTypes.bool,
  // /** Show text on Axis */
  showAxisLabels: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.oneOf(["both", "yAxis", "xAxis", "none"]),
  ]),
  // /** Spacing of Ticks on Y Axis */
  // tickSpacing: PropTypes.oneOf(["wide", "normal", "narrow"]),
  /** Display Axis and ticks  */
  hideAxisLine: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.oneOf(["both", "yAxis", "xAxis", "none"]),
  ]),
  /** Show gridline rows on Axis */
  showGridRows: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]), // RENAME
  /** Show gridline columns on Axis */
  showGridColumns: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]), // RENAME
  /** Show shadow around Area Chart */
  showBoxShadow: PropTypes.bool,
  /** Border of the Pie Chart, need desc */
  border: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.oneOf([
      "top",
      "left",
      "bottom",
      "right",
      "start",
      "end",
      "horizontal",
      "vertical",
      "all",
      "between",
      "none",
    ]),
    PropTypes.shape({
      color: PropTypes.oneOfType([PropTypes.string]),
      side: PropTypes.oneOf([
        "top",
        "left",
        "bottom",
        "right",
        "start",
        "end",
        "horizontal",
        "vertical",
        "all",
        "between",
      ]),
      size: PropTypes.oneOfType([PropTypes.string]),
      style: PropTypes.oneOf([
        "solid",
        "dashed",
        "dotted",
        "double",
        "groove",
        "ridge",
        "inset",
        "outset",
        "hidden",
      ]),
    }),
    PropTypes.arrayOf(BORDER_SHAPE),
  ]),
  // /** Border radius of the chart */
  borderRadius: PropTypes.string,
  // /** Background Color of the chart */
  backgroundColor: PropTypes.string,
  // /** color scheme of the chart */
  colorTheme: PropTypes.oneOfType([
    PropTypes.oneOf([
      "motor",
      "divergent9",
      "divergent13",
      "eco",
      "bio",
      "red",
      "blue",
      "gray",
      "pink",
      "grape",
      "violet",
      "indigo",
      "blue",
      "cyan",
      "teal",
      "green",
      "lime",
      "yellow",
      "orange",
      "base",
      "light",
      "dark",
    ]),
    PropTypes.array,
  ]),
  /** Stacked Chart  */
  stacked: PropTypes.bool,
  /** Stacked Chart  */
  showAsPercent: PropTypes.bool,
  /** RoundNum of the Area */
  roundNum: PropTypes.bool,
  /** Decimai precision for RoundNum of the Area */
  precision: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
  /** Title of the Area */
  title: PropTypes.string,
  /** Sub Title of the Area */
  subTitle: PropTypes.string,
  /** Legend of the chart */
  showLegend: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.oneOf(["right", "bottom"]),
  ]),
  /** Show tooltip */
  showTooltip: PropTypes.bool,
  /** SelectionMethod */
  selectionMethod: PropTypes.oneOf(["click", "brush", "none"]),
  // /** Maximum Width of the Area */
  // maxWidth: PropTypes.number,
  // /** Force supression of Scroll / Overview chart */
  // suppressScroll: PropTypes.bool,
  // // /** Allow for bushes to be resized on chart */
  // // allowZoom: PropTypes.bool, // Descoped to later version
  // // /** Ratio of the size 0f the scroll bar (Range 0 - 1) */
  // // scrollRatio: PropTypes.number, // Descoped to later version
  /** Pddding for each bar */
  padding: PropTypes.number,
  /** Shape of the symbol to be used on the line. This will apply to all series on the chart */
  showPoints: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string, // { symbol : "circle","cross","diamond","square","star","triangle","wye","none", size}
  ]),
  /** Show values as Other */
  otherTotalSpec: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.shape({
      qOtherLabel: PropTypes.string,
      qOtherCount: PropTypes.string,
    }),
  ]),
  /** Name of the parent grid area to place the box */
  gridArea: PropTypes.string,
  useAnimatedAxes: PropTypes.bool,
  useAnimatedGrid: PropTypes.bool, // NEW
  animationTrajectory: PropTypes.oneOf(["center", "outside", "min", "max"]), // NEW
  // autoWidth: PropTypes.bool, // REMOVED
  renderHorizontally: PropTypes.bool,
  includeZero: PropTypes.bool,
  xAxisOrientation: PropTypes.oneOf(["top", "bottom"]),
  yAxisOrientation: PropTypes.oneOf(["left", "right"]),
  legendLeftRight: PropTypes.oneOf(["left", "right"]),
  legendTopBottom: PropTypes.oneOf(["top", "bottom"]),
  legendDirection: PropTypes.oneOf(["row", "column"]),
  legendShape: PropTypes.string,
  backgroundPattern: PropTypes.oneOf(["Lines", "Circles", "Hexagon", "Waves"]),
  /** BackgroundSTyle */
  /** either : style of one of below or bckgroundFrom and bckgroundTo */
  /**  Linear  */
  /**  Radial  */
  /**  DarkGreen  */
  /**  LightGreen  */
  /**  OrangeRed  */
  /**  PinkBlue  */
  /**  PinkRed  */
  /**  PurpleOrangle  */
  /**  PurpleRed  */
  /**  PurpleTeal  */
  /**  SteelPurple  */
  /**  TealBlue  */
  backgroundStyle: PropTypes.object,
  /** fillStyle */
  /** either : style of one of below or fillFrom and FillTo as object*/
  /** {style:"Linear", fillFrom : "#c21500",fillTo : "#ffc500"} */
  fillStyle: PropTypes.oneOf([
    "DarkGreen",
    "LightGreen",
    "OrangeRed",
    "PinkBlue",
    "PinkRed",
    "PurpleOrangle",
    "PurpleRed",
    "PurpleTeal",
    "SteelPurple",
    "TealBlue",
    PropTypes.object,
  ]),
  /**  curveShape of the line */
  curveShape: PropTypes.oneOf([
    "Basis",
    "BasisClose",
    "BasisOpen",
    "Step",
    "StepAfter",
    "StepBefore",
    "Bundle",
    "Linear",
    "LinearClosed",
    "MonotoneX",
    "MonotoneY",
    "Cardinal",
    "CardinalClosed",
    "CardinalOpen",
    "CatmullRom",
    "CatmullRomClosed",
    "CatmullRomOpen",
    "Natural",
  ]),
  multiColor: PropTypes.bool,
  events: PropTypes.bool,
  /** Use dual Y axis on the the chart  */
  dualAxis: PropTypes.bool,
  // /** Show CrossHair on the chart  */
  // showCrossHair: PropTypes.bool, // REMOVED
  /** Show Horizontal CrossHair on the chart  */
  showHorizontalCrosshair: PropTypes.bool, // ADDED
  /** Show Vertical CrossHair on the chart  */
  showVerticalCrosshair: PropTypes.bool, // ADDED
  /** Horizontal styling of the CrossHair. */
  horizontalCrosshairStyle: PropTypes.object,
  /** Vertical styling of the CrossHair. */
  verticalCrosshairStyle: PropTypes.object,
  /** Styling of the Legend labels. */
  legendLabelStyle: PropTypes.object,
  /** Styling of the Value labels. */
  valueLabelStyle: PropTypes.object,
  /** Used for tooltip. If true only show the item that hovered over. If fasle show all items for that stack / group  */
  showClosestItem: PropTypes.bool,
  /** Only use one color for the toolyip instead of multi color per item. */
  useSingleColor: PropTypes.bool,
  /** Snap to X Axis (normally true for bar or combo) */
  snapTooltipToDatumX: PropTypes.bool,
  /** Snap to Y Axis (normally true for bar or combo) */
  snapTooltipToDatumY: PropTypes.bool,
  /** Show value only for Tooltip */
  valueOnly: PropTypes.bool,
  /** Show single line fo text and value for tooltip */
  valueWithText: PropTypes.bool,
  /** Input format of date supplied from engine (in qText) */
  parseDateFormat: PropTypes.string,
  /** Reposition the tooltip. */
  shiftTooltipTop: PropTypes.number,
  /** Reposition the tooltip. */
  shiftTooltipLeft: PropTypes.number,
  /** Number of ticks for the Grid Rows. Leave blank to auto calculate */
  numGridRows: PropTypes.number, // NEW
  /** Number of ticks for the Grid Columns. Leave blank to auto calculate */
  numGridColumns: PropTypes.number, // NEW
  /** Number of ticks for the X Axis. Leave blank to auto calculate */
  numDimensionTicks: PropTypes.number,
  /** Number of ticks for the Y Axis. Leave blank to auto calculate */
  numMeasureTicks: PropTypes.number,
  /** Number of ticks for the dual Y Axis. Leave blank to auto calculate */
  numMeasureDualTicks: PropTypes.number,
  /** Format of dates to be displayed on XAxis. */
  formatAxisDate: PropTypes.string,
  /** Area stroke width */
  strokeWidth: PropTypes.number,
  /** Styles for the X Axis */
  xAxisStyles: PropTypes.object,
  /** Styles for the Y Axis */
  yAxisStyles: PropTypes.object,
  /** Styling for the tooltip */
  tooltipStyles: PropTypes.object,
};

Area.defaultProps = {
  calcCondition: undefined,
  width: "100%",
  height: "400px", // 100%
  size: "medium",
  border: true,
  /** Use dual Y axis on the the chart  */
  dualAxis: false,
  colorTheme: null,
  sortOrder: [],
  sortDirection: "",
  stacked: false,
  showAsPercent: false,
  gridArea: null,
  xAxisOrientation: "bottom",
  yAxisOrientation: "left",
  legendLeftRight: "right",
  legendTopBottom: "top",
  legendDirection: "row",
  legendShape: "auto",
  parseDateFormat: null,
  formatAxisDate: null,
  strokeWidth: null,
  numDimensionTicks: null,
  numMeasureTicks: null,
  numMeasureDualTicks: null,
  showHorizontalCrosshair: false,
  showVerticalCrosshair: false,
  showTooltip: true,
};

export default Area;
