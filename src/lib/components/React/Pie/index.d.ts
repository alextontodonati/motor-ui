import * as React from "react";
import {
  configType,
  sizeType,
  calcCondType,
  showLabelsType,
  textOnAxisType,
  tickSpacingType,
  showAxisType,
  showGridlinesType,
  borderType,
  colorThemeType,
  showLegendType,
  otherTotalSpecType,
} from "../../../utils";

export interface XYChartProps {
  config?: configType;
  label?: string;
  cols?: Array<string>;
  calcCondition?: calcCondType;
  suppressZero?: boolean;
  columnSortOrder?: Array<string>;
  sortDirection?: string;
  width?: string;
  height?: string;
  margin?: string;
  size?: sizeType;
  showLabels?: showLabelsType;
  textOnAxis?: textOnAxisType;
  tickSpacing?: tickSpacingType;
  hideAxisLine?: showAxisType;
  maxAxisLength?: number;
  allowSlantedYAxis?: boolean;
  showGridlines?: showGridlinesType;
  fontColor?: string;
  border?: borderType;
  backgroundColor?: string;
  colorTheme?: colorThemeType;
  stacked?: boolean;
  percentStacked?: boolean;
  roundNum?: boolean;
  title?: string;
  subTitle?: string;
  showLegend?: showLegendType;
  allowSelections?: boolean;
  maxWidth?: number;
  suppressScroll?: boolean;
  barPadding?: number;
  dimensionErrMsg?: string;
  measureErrMsg?: string;
  otherTotalSpec?: otherTotalSpecType;
}

declare const XYChart: React.FC<XYChartProps>;

export type XYChartType = XYChartProps;

export default XYChart;
