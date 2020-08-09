"use strict";

import React, { Component } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
// import baseStyles from "./baseStyles";
// import BurgerIcon from "./BurgerIcon";
// import CrossIcon from "./CrossIcon";
// import Box from "../Box";
import {
  Overlay,
  MenuWrap,
  MenuMain,
  ItemList,
  CloseIcon,
  MenuIcon,
  FilterIcon,
  MenuHeader,
  MenuFooter,
} from "./SideBarTheme";
import "./styles.css";

export default (styles) => {
  class Menu extends Component {
    constructor(props) {
      super(props);
      this.state = {
        isOpen: false,
      };

      if (!styles) {
        throw new Error("No styles supplied");
      }
    }

    toggleMenu(options = {}) {
      const { isOpen, noStateChange } = options;
      const newState = {
        isOpen: typeof isOpen !== "undefined" ? isOpen : !this.state.isOpen,
      };

      this.applyWrapperStyles();

      this.setState(newState, () => {
        !noStateChange && this.props.onStateChange(newState);

        // if (!this.props.disableAutoFocus) {
        //   // For accessibility reasons, ensures that when we toggle open,
        //   // we focus the first menu item if one exists.
        //   if (newState.isOpen) {
        //     const firstItem = document.querySelector(".bm-item");
        //     if (firstItem && this.props.focusFirstItem) {
        //       firstItem.focus();
        //     }
        //   } else {
        //     if (document.activeElement) {
        //       document.activeElement.blur();
        //     } else {
        //       document.body.blur(); // Needed for IE
        //     }
        //   }
        // }

        // Timeout ensures wrappers are cleared after animation finishes.
        this.timeoutId && clearTimeout(this.timeoutId);
        this.timeoutId = setTimeout(() => {
          this.timeoutId = null;
          if (!newState.isOpen) {
            this.applyWrapperStyles(false);
          }
        }, 500);
      });
    }

    open() {
      if (typeof this.props.onOpen === "function") {
        this.props.onOpen();
      } else {
        this.toggleMenu();
      }
    }

    close() {
      if (typeof this.props.onClose === "function") {
        this.props.onClose();
      } else {
        this.toggleMenu();
      }
    }

    overlayClick() {
      if (!this.state.isOpen) return;
      if (
        this.props.disableOverlayClick === true ||
        (typeof this.props.disableOverlayClick === "function" &&
          this.props.disableOverlayClick())
      ) {
        return;
      } else {
        this.close();
      }
    }

    // Applies component-specific styles to external wrapper elements.
    applyWrapperStyles(set = true) {
      const applyClass = (el, className) =>
        el.classList[set ? "add" : "remove"](className);

      if (this.props.htmlClassName) {
        applyClass(document.querySelector("html"), this.props.htmlClassName);
      }
      if (this.props.bodyClassName) {
        applyClass(document.querySelector("body"), this.props.bodyClassName);
      }

      if (styles.pageWrap && this.props.pageWrapId) {
        this.handleExternalWrapper(this.props.pageWrapId, styles.pageWrap, set);
      }

      if (styles.outerContainer && this.props.outerContainerId) {
        this.handleExternalWrapper(
          this.props.outerContainerId,
          styles.outerContainer,
          set
        );
      }
    }

    // Sets or unsets styles on DOM elements outside the menu component.
    // This is necessary for correct page interaction with some of the menus.
    // Throws and returns if the required external elements don't exist,
    // which means any external page animations won't be applied.
    handleExternalWrapper(id, wrapperStyles, set) {
      const wrapper = document.getElementById(id);

      if (!wrapper) {
        console.error("Element with ID '" + id + "' not found");
        return;
      }

      const builtStyles = this.getStyle(wrapperStyles);

      for (const prop in builtStyles) {
        if (builtStyles.hasOwnProperty(prop)) {
          wrapper.style[prop] = set ? builtStyles[prop] : "";
        }
      }

      // Prevent any horizontal scroll.
      // Only set overflow-x as an inline style if htmlClassName or
      // bodyClassName is not passed in. Otherwise, it is up to the caller to
      // decide if they want to set the overflow style in CSS using the custom
      // class names.
      const applyOverflow = (el) =>
        (el.style["overflow-x"] = set ? "hidden" : "");
      if (!this.props.htmlClassName) {
        applyOverflow(document.querySelector("html"));
      }
      if (!this.props.bodyClassName) {
        applyOverflow(document.querySelector("body"));
      }
    }

    // Builds styles incrementally for a given element.
    getStyles(el, index, inline) {
      const propName =
        "bm" + el.replace(el.charAt(0), el.charAt(0).toUpperCase());

      // Set base styles.
      let output = {};

      // Add animation-specific styles.
      if (styles[el]) {
        output = {
          ...output,
          ...this.getStyle(styles[el], index + 1),
        };
      }

      // Add custom styles.
      if (this.props.styles[propName]) {
        output = {
          ...output,
          ...this.props.styles[propName],
        };
      }

      // Add element inline styles.
      if (inline) {
        output = {
          ...output,
          ...inline,
        };
      }

      // Remove transition if required
      // (useful if rendering open initially).
      if (this.props.noTransition) {
        delete output.transition;
      }

      return output;
    }

    getStyle(style, index) {
      const { width } = this.props;
      const formattedWidth = typeof width !== "string" ? `${width}px` : width;
      return style(this.state.isOpen, formattedWidth, this.props.right, index);
    }

    listenForClose(e) {
      e = e || window.event;

      // Close on ESC, unless disabled
      if (
        !this.props.disableCloseOnEsc &&
        this.state.isOpen &&
        (e.key === "Escape" || e.keyCode === 27)
      ) {
        this.close();
      }
    }

    componentDidMount() {
      // Bind ESC key handler (unless custom function supplied).
      if (this.props.customOnKeyDown) {
        window.onkeydown = this.props.customOnKeyDown;
      } else {
        window.onkeydown = this.listenForClose.bind(this);
      }

      // Allow initial open state to be set by props.
      if (this.props.isOpen) {
        this.toggleMenu({ isOpen: true, noStateChange: true });
      }
    }

    componentWillUnmount() {
      window.onkeydown = null;

      this.applyWrapperStyles(false);

      // Avoid potentially attempting to update an unmounted component.
      this.timeoutId && clearTimeout(this.timeoutId);
    }

    componentDidUpdate(prevProps) {
      const wasToggled =
        typeof this.props.isOpen !== "undefined" &&
        this.props.isOpen !== this.state.isOpen &&
        this.props.isOpen !== prevProps.isOpen;
      if (wasToggled) {
        this.toggleMenu();
        // Toggling changes SVG animation requirements, so we defer these until the next componentDidUpdate
        return;
      }

      if (styles.svg) {
        const morphShape = ReactDOM.findDOMNode(this, "bm-morph-shape");
        const path = styles.svg.lib(morphShape).select("path");

        if (this.state.isOpen) {
          // Animate SVG path.
          styles.svg.animate(path);
        } else {
          // Reset path (timeout ensures animation happens off screen).
          setTimeout(() => {
            path.attr("d", styles.svg.pathInitial);
          }, 300);
        }
      }
    }

    render() {
      return (
        <div>
          {!this.props.noOverlay && (
            <Overlay
              isOpen={this.state.isOpen}
              theme={this.props.theme}
              overlayBackground={this.props.overlayBackground}
              onClick={() => this.overlayClick()}
            />
          )}
          <MenuWrap
            id={this.props.id}
            isOpen={this.state.isOpen}
            sideBarWidth={this.props.width}
            right={this.props.right}
            // rows={["60px", "auto", "30px"]}
            // cols={["auto"]}
            // areas={[["header"], ["main"], ["footer"]]}
            borderRadius={this.props.borderRadius}
            backgroundColor={this.props.backgroundColor}
            border={this.props.border}
            headerHeight={this.props.header ? this.props.headerHeight : "0"}
            footerHeight={this.props.footer ? this.props.footerHeight : "0"}
          >
            {styles.svg && (
              <div
                className={`bm-morph-shape ${this.props.morphShapeClassName}`.trim()}
                style={this.getStyles("morphShape")}
              >
                <svg
                  width="100%"
                  height="100%"
                  viewBox="0 0 100 800"
                  preserveAspectRatio="none"
                >
                  <path d={styles.svg.pathInitial} />
                </svg>
              </div>
            )}{" "}
            {this.props.header && (
              <MenuHeader border="bottom">{this.props.header}</MenuHeader>
            )}
            <MenuMain header={this.props.header} footer={this.props.footer}>
              <ItemList>
                {React.Children.map(this.props.children, (item) => {
                  return React.cloneElement(item);
                })}
              </ItemList>
            </MenuMain>
            {this.props.footer && (
              <MenuFooter border="top">{this.props.footer}</MenuFooter>
            )}
            <CloseIcon
              onClick={() => this.close()}
              theme={this.props.theme}
              size={25}
              right={this.props.right}
            />
          </MenuWrap>
          {
            {
              menu: (
                <MenuIcon
                  openIconColor={this.props.openIconColor}
                  onClick={() => this.open()}
                  size={35}
                  right={this.props.right}
                />
              ),
              filter: (
                <FilterIcon
                  openIconColor={this.props.openIconColor}
                  onClick={() => this.open()}
                  size={35}
                  right={this.props.right}
                />
              ),
            }[this.props.openIcon || "menu"]
          }
        </div>
      );
    }
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

  Menu.propTypes = {
    bodyClassName: PropTypes.string,
    burgerBarClassName: PropTypes.string,
    burgerButtonClassName: PropTypes.string,
    className: PropTypes.string,
    crossButtonClassName: PropTypes.string,
    crossClassName: PropTypes.string,
    customBurgerIcon: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.oneOf([false]),
    ]),
    customCrossIcon: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.oneOf([false]),
    ]),
    customOnKeyDown: PropTypes.func,
    // disableAutoFocus: PropTypes.bool,
    disableCloseOnEsc: PropTypes.bool,
    disableOverlayClick: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
    htmlClassName: PropTypes.string,
    id: PropTypes.string,
    isOpen: PropTypes.bool,
    itemClassName: PropTypes.string,
    itemListClassName: PropTypes.string,
    menuClassName: PropTypes.string,
    morphShapeClassName: PropTypes.string,
    noOverlay: PropTypes.bool,
    noTransition: PropTypes.bool,
    onClose: PropTypes.func,
    onIconHoverChange: PropTypes.func,
    onOpen: PropTypes.func,
    onStateChange: PropTypes.func,
    outerContainerId:
      styles && styles.outerContainer
        ? PropTypes.string.isRequired
        : PropTypes.string,
    overlayClassName: PropTypes.string,
    pageWrapId:
      styles && styles.pageWrap
        ? PropTypes.string.isRequired
        : PropTypes.string,
    right: PropTypes.bool,
    styles: PropTypes.object,
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    focusFirstItem: PropTypes.bool,
    headerHeight: PropTypes.string,
    footerHeight: PropTypes.string,

    // new for motor-js
    type: PropTypes.oneOf(
      "slide",
      "stack",
      "push",
      "pushRotate",
      "scaleDown",
      "scaleRotate",
      "fallDown",
      "reveal"
    ),
    header: PropTypes.node,
    footer: PropTypes.node,
    openIcon: PropTypes.oneOf("menu", "filter"),
    openIconColor: PropTypes.string,
    /** Set background color */
    backgroundColor: PropTypes.string,
    /** Set border radius */
    borderRadius: PropTypes.string,

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
  };

  Menu.defaultProps = {
    bodyClassName: "",
    burgerBarClassName: "",
    burgerButtonClassName: "",
    className: "",
    crossButtonClassName: "",
    crossClassName: "",
    // disableAutoFocus: false,
    disableCloseOnEsc: false,
    htmlClassName: "",
    id: "",
    itemClassName: "",
    itemListClassName: "",
    menuClassName: "",
    morphShapeClassName: "",
    noOverlay: false,
    noTransition: false,
    onStateChange: () => {},
    outerContainerId: "",
    overlayClassName: "",
    pageWrapId: "",
    styles: {},
    width: "300px",
    onIconHoverChange: () => {},
    focusFirstItem: true,

    // new for motor-js
    border: true,
    headerHeight: "80px",
    footerHeight: "100px",
  };

  return Menu;
};
