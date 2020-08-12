import React, { useContext } from "react";
// import PropTypes from "prop-types";
// import { ThemeContext } from "styled-components";
// import StyledArea from "./StyledArea";
// import { ConfigContext } from "../../../contexts/ConfigProvider";
// import defaultTheme from "../../../themes/defaultTheme";
// import { EngineContext } from "../../../contexts/EngineProvider";
// import useEngine from "../../../hooks/useEngine";

import {
  WithTooltip,
  ResponsiveXYChart,
  LinearGradient,
  PatternLines,
  BarSeries,
} from "../../VX/xy-chart";

import colors from "../../VX/theme/color";

import { timeSeriesData } from "./data";
// import AreaDifferenceSeriesExample from "./AreaChart";
import AreaDifferenceSeriesExample from "./AreaDifferenceSeriesExample";

function Area(props) {
  // const myConfig = config || useContext(ConfigContext);
  // const theme = useContext(ThemeContext) || defaultTheme;
  // const { engine, engineError } =
  //   useContext(EngineContext) || useEngine(myConfig);

  return <AreaDifferenceSeriesExample />;
}

export default Area;
