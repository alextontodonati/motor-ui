import React, { useContext } from "react";
import PropTypes from "prop-types";
import { ThemeContext } from "styled-components";
import StyledSandBox from "./StyledSandBox";
import { ConfigContext } from "../../../../contexts/ConfigProvider";
import defaultTheme from "../../../../themes/defaultTheme";
// import { EngineContext } from "../../../contexts/EngineProvider";
import { EngineContext } from "../../../../contexts/EngineProvider";
import useEngine from "../../../../hooks/useEngine";

function SandBox({ config, ...rest }) {
  const myConfig = config || useContext(ConfigContext);
  const theme = useContext(ThemeContext) || defaultTheme;
  const { engine, engineError } =
    useContext(EngineContext) || useEngine(myConfig);

  return (
    <StyledSandBox
      engine={engine}
      theme={theme}
      engineError={engineError}
      {...rest}
    />
  );
}

SandBox.propTypes = {
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
    ]),
    PropTypes.array,
  ]),
};

SandBox.defaultProps = {
  width: "100%",
  height: 400,
  colorTheme: null,
};

export default SandBox;
