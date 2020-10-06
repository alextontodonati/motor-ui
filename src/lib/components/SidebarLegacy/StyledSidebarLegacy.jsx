import styled, { css } from "styled-components";
import { defaultProps } from "../../../default-props";
import Box from "../Box";

const collapsableStyle = css`
  position: absolute;
  top: 0;
  bottom: 0;
  left: ${({ pullRight }) => (pullRight ? null : 0)};
  right: ${({ pullRight }) => (pullRight ? 0 : null)};
  z-index: 999;
  width:  ${(props) => props.width} 
  transition: transform 0.3s ease-in-out;
  transform: ${({ open }) => (open ? "translateX(0)" : "translateX(-100%)")};
  display: ${({ open }) => (open ? "flex" : "none")};
`;

const StyledSidebarLegacy = styled(Box)`
  ${(props) => props.collapsable && collapsableStyle}
`;

const SidebarLegacyOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 998;
  width: 100%;
  height: 100%;
  background-color: ${({ overlay }) =>
    `rgba(105,105,105, ${overlay ? 0.3 : 0.0})`};
  display: ${({ open }) => (open ? "block" : "none")};
`;

// const SidebarLegacyOverlay = styled.div`
//   ${(props) => props.collapsable && overlayStyle}
// `;

StyledSidebarLegacy.defaultProps = {};
Object.setPrototypeOf(StyledSidebarLegacy.defaultProps, defaultProps);

SidebarLegacyOverlay.defaultProps = {};
Object.setPrototypeOf(SidebarLegacyOverlay.defaultProps, defaultProps);

export { StyledSidebarLegacy, SidebarLegacyOverlay };
