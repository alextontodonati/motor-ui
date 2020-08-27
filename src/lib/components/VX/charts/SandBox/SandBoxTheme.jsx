import styled from "styled-components";
import { defaultProps } from "../../../../default-props";
import { globalStyle, borderStyle } from "../../../../utils/styles";
import { componentWidth } from "../../../../utils";

const SandBoxWrapper = styled.div`
  ${globalStyle};
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
  margin: ${(props) => props.margin};
  userselect: ${(props) => props.theme.global.chart.userSelect};
  width: ${(props) => componentWidth(props)};
  // width: ${(props) => props.width};
  display: ${(props) => props.theme.global.chart.display};
  box-sizing: ${(props) => props.theme.global.chart.boxSizing};
`;

const SandBoxWrapperNoData = styled.div`
  ${globalStyle};
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
  height: ${(props) => props.height};
  width: ${(props) => componentWidth(props)};
  // width: ${(props) => props.width};
  box-sizing: ${(props) => props.theme.global.chart.boxSizing};
  margin: ${(props) => props.margin};
`;

const SandBoxNoDataContent = styled.div`
  ${globalStyle};
  display: ${(props) => props.theme.global.chart.noDataContent.display};
  margin: ${(props) => props.theme.global.chart.noDataContent.margin};
  align-items: ${(props) => props.theme.global.chart.noDataContent.alignItems};
  justify-content: ${(props) =>
    props.theme.global.chart.noDataContent.justifyContent};
  height: ${(props) => props.height};
`;

SandBoxWrapper.defaultProps = {};
Object.setPrototypeOf(SandBoxWrapper.defaultProps, defaultProps);

SandBoxWrapperNoData.defaultProps = {};
Object.setPrototypeOf(SandBoxWrapperNoData.defaultProps, defaultProps);

SandBoxNoDataContent.defaultProps = {};
Object.setPrototypeOf(SandBoxNoDataContent.defaultProps, defaultProps);

export { SandBoxWrapper, SandBoxWrapperNoData, SandBoxNoDataContent };
