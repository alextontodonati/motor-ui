import styled from "styled-components";
import { defaultProps } from "../../../default-props";
import { globalStyle, borderStyle } from "../../../utils/styles";
import { createColorArray } from "../../../utils/colors";
import { selectColor } from "../../../utils/colors";
import { componentWidth } from "../../../utils";

const ColumnWrapper = styled.div`
  ${globalStyle};
  ${(props) => props.gridArea && `grid-area: ${props.gridArea};`};
  ${(props) =>
    props.border &&
    props.border !== "none" &&
    (Array.isArray(props.border, props.theme)
      ? props.border.map((border) => borderStyle(border, props.theme, "chart"))
      : borderStyle(props.border, props.theme, "chart"))};
  border-radius: ${(props) =>
    props.borderRadius || props.theme.global.chart.borderRadius};
  background-color: ${(props) =>
    props.backgroundColor || props.theme.global.chart.backgroundColor};
  margin: ${(props) => props.margin || props.theme.global.chart.margin};
  width: ${(props) => componentWidth(props)};
  userselect: ${(props) => props.theme.global.chart.userSelect};
  display: ${(props) => props.theme.global.chart.display};
  box-sizing: ${(props) => props.theme.global.chart.boxSizing};
`;

const ColumnWrapperNoData = styled.div`
  ${globalStyle};
  ${(props) => props.gridArea && `grid-area: ${props.gridArea};`};
  ${(props) =>
    props.border &&
    (Array.isArray(props.border, props.theme)
      ? props.border.map((border) => borderStyle(border, props.theme, "chart"))
      : borderStyle(props.border, props.theme, "chart"))};
  vertical-align: ${(props) => props.theme.global.chart.noData.verticalAlign};
  display: ${(props) => props.theme.global.chart.noData.display};
  border-radius: ${(props) =>
    props.borderRadius || props.theme.global.chart.noData.borderRadius};
  background-color: ${(props) =>
    props.theme.global.chart.noData.backgroundColor};
  border-collapse: ${(props) => props.theme.global.chart.noData.borderCollapse};
  width: ${(props) => componentWidth(props)};
  box-sizing: ${(props) => props.theme.global.chart.boxSizing};
  margin: ${(props) => props.margin || props.theme.global.chart.margin};
`;

const ColumnNoDataContent = styled.div`
  ${globalStyle};
  display: ${(props) => props.theme.global.chart.noDataContent.display};
  margin: ${(props) => props.theme.global.chart.noDataContent.margin};
  align-items: ${(props) => props.theme.global.chart.noDataContent.alignItems};
  justify-content: ${(props) =>
    props.theme.global.chart.noDataContent.justifyContent};
  height: ${(props) => props.height};
`;

ColumnWrapper.defaultProps = {};
Object.setPrototypeOf(ColumnWrapper.defaultProps, defaultProps);

ColumnWrapperNoData.defaultProps = {};
Object.setPrototypeOf(ColumnWrapperNoData.defaultProps, defaultProps);

ColumnNoDataContent.defaultProps = {};
Object.setPrototypeOf(ColumnNoDataContent.defaultProps, defaultProps);

export { ColumnWrapper, ColumnWrapperNoData, ColumnNoDataContent };

function ColumnTheme(theme, size, fontColor, colorArray) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const {
    global: {
      fontFamily,
      chart,
      size: fontSize,
      colorTheme,
      chart: { gridlines, selection, nonSelection },
    },
    column: {
      main,
      overview,
      columns: { stroke, strokeWidth },
    },
    xAxis,
    yAxis,
    axisTitle,
  } = theme;

  // if the prop is undefined, use the base theme
  const color = colorArray || colorTheme;
  const colorPalette = createColorArray(color, theme);

  const xAxisColor = selectColor(xAxis.color, theme);
  const yAxisColor = selectColor(yAxis.color, theme);
  const axisTitleColor = selectColor(axisTitle.color, theme);
  const labelColor = selectColor(chart.label.fontColor, theme);

  const ColumnDefault = {
    allowSelections: chart.allowSelections,
    tickSpacing: chart.tickSpacing,
    suppressZero: chart.suppressZero,
    suppressScroll: chart.suppressScroll,
    allowZoom: chart.allowZoom,
    showLabels: chart.showLabels,
    showLegend: chart.showLegend,
    textOnAxis: chart.textOnAxis,
    otherTotalSpec: main.otherTotalSpec,
    zoomScrollOnColumnWidth: main.zoomScrollOnColumnWidth,
    columnPadding: main.columnPadding,
    columnPaddingNarrow: main.columnPaddingNarrow,
    showAxis: chart.showAxis,
    showGridlines: chart.showGridlines,
    maxWidth: main.maxWidth,
    dimensionErrMsg: chart.error.dimensionErrMsg,
    measureErrMsg: chart.error.measureErrMsg,
    maxAxisLength: chart.maxAxisLength,
  };

  const ColumnOverviewColumn = {
    opacity: overview.opacity,
    stroke: overview.stroke,
    "stroke-width": overview.strokeWidth,
  };

  const ColumnChartStyle = {
    "font-family": fontFamily,
    "font-size": fontSize.font[size],
  };

  const yAxisStyle = {
    "font-family": fontFamily,
    "font-size": fontSize.font[size],
    "-webkit-user-select": "none",
    "-khtml-user-select": "none",
    "-moz-user-select": "none",
    "-ms-user-select": "none",
    "user-select": "none",
    color: yAxisColor,
  };

  const xAxisStyle = {
    "font-family": fontFamily,
    "font-size": fontSize.font[size],
    "-webkit-user-select": "none",
    "-khtml-user-select": "none",
    "-moz-user-select": "none",
    "-ms-user-select": "none",
    "user-select": "none",
    color: xAxisColor,
  };

  const axisTitleStyle = {
    "font-family": fontFamily,
    "font-size": fontSize.font[size],
    "-webkit-user-select": "none",
    "-khtml-user-select": "none",
    "-moz-user-select": "none",
    "-ms-user-select": "none",
    "user-select": "none",
    fill: axisTitleColor,
  };

  const ColumnLabelStyle = {
    "font-size": fontSize.subFont[size],
    "-webkit-user-select": "none",
    "-khtml-user-select": "none",
    "-moz-user-select": "none",
    "-ms-user-select": "none",
    "user-select": "none",
    fill: fontColor || labelColor,
  };

  const ColumnStyle = {
    stroke: stroke,
    "stroke-width": strokeWidth,
  };

  const GridLineStyle = {
    show: gridlines.show,
    stroke: gridlines.stroke,
    "stroke-dasharray": gridlines.strokeDasharray,
  };

  const SelectedColumn = {
    opacity: selection.opacity,
    stroke: selection.stroke,
    "stroke-width": selection.strokeWidth,
  };

  const NonSelectedColumn = {
    opacity: nonSelection.opacity,
  };

  const ColumnThemes = {
    ColumnChartStyle,
    ColumnDefault,
    yAxisStyle,
    xAxisStyle,
    axisTitleStyle,
    ColumnLabelStyle,
    ColumnStyle,
    GridLineStyle,
    ColumnOverviewColumn,
    colorPalette,
    SelectedColumn,
    NonSelectedColumn,
  };

  return {
    ColumnThemes,
  };
}

export default ColumnTheme;
