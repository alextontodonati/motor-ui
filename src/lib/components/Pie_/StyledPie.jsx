import React, { useRef, useEffect, useState } from "react";
import useHyperCube from "../../hooks/useHyperCube";
import useOutsideClick from "../../hooks/useOutsideClick";
import SelectionModal from "../SelectionModal";
import { PieWrapper, PieWrapperNoData, PieNoDataContent } from "./PieTheme";
import Spinner from "../Spinner";
import CreatePie from "./CreatePie";

import {
  numericSortDirection,
  isEmpty,
  validData,
  createColorArray,
  valueIfUndefined,
} from "../../utils";

let measureCount = null;
let dimensionCount = null;
let singleDimension = null;
let singleMeasure = null;
let dataKeys = null;

function StyledPie(props) {
  // Ref for d3 object
  const d3Container = useRef(null);
  const ref = useRef();
  const [currentSelectionIds, setCurrentSelectionIds] = useState([]);
  const [calcCond, setCalcCond] = useState(null);
  const [dataError, setDataError] = useState(null);
  const [isValid, setIsValid] = useState(null);
  const [data, setData] = useState(null);

  // props
  const {
    engine,
    engineError,
    theme,
    cols,
    width,
    height,
    events,
    margin,
    size,
    border,
    borderRadius,
    backgroundColor,
    colorTheme,
    showLegend,
    selectionMethod,
    sortDirection,
    sortOrder,
    calcCondition,
    suppressZero,
    otherTotalSpec,
    gridArea,
    type,
    backgroundStyle,
    multiColor,
    showBoxShadow,
    showAsPercent,
    ...rest
  } = props;

  const {
    global: { colorTheme: globalColorTheme, chart },
  } = theme;

  // if the prop is undefined, use the base theme
  const colorPalette = createColorArray(colorTheme || globalColorTheme, theme);

  const refMargin = "10px";

  // retrieve Pie data from HyperCube
  const {
    beginSelections,
    endSelections,
    qLayout,
    qData,
    selections,
    select,
  } = useHyperCube({
    engine,
    cols,
    qSortByNumeric: numericSortDirection(sortDirection, -1),
    qSortByAscii: numericSortDirection(sortDirection, 1),
    qInterColumnSortOrder: sortOrder,
    qCalcCondition: calcCondition,
    qSuppressZero: suppressZero || chart.suppressZero,
    qOtherTotalSpec: otherTotalSpec || chart.otherTotalSpec,
    qSuppressZero: true,
  });

  const cancelCallback = () => {
    endSelections(false);
    setCurrentSelectionIds([]);
  };

  const confirmCallback = async () => {
    await endSelections(true);
    setCurrentSelectionIds([]);
  };

  useOutsideClick(ref, () => {
    if (
      event.target.classList.contains("cancelSelections") ||
      event.target.parentNode.classList.contains("cancelSelections")
    )
      return;
    if (!isEmpty(currentSelectionIds)) {
      const outsideClick = !ref.current.contains(event.target);
      if (outsideClick && selections) confirmCallback();
    }
  });

  const handleResize = () => {
    if (typeof calcCond === "undefined" && dataError.length === 0) {
      // CreatePie({ ...chartSettings, screenWidth: ref.current.offsetWidth });
    }
  };

  useEffect(() => {
    let valid;
    if (qLayout) {
      // setObjId(qLayout.qInfo.qId);
      setCalcCond(qLayout.qHyperCube.qCalcCondMsg);
      valid = validData(qLayout, theme);
      if (valid) {
        setIsValid(valid.isValid);
        setDataError(valid.dataError);
      }
    }

    if (
      // (qData && data === null) ||
      // (qData && data && qData.qMatrix.length !== data.length && isValid)
      (qData && data === null) ||
      (qData && data && isValid)
    ) {
      dimensionCount = qLayout.qHyperCube.qDimensionInfo.length;
      measureCount = qLayout.qHyperCube.qMeasureInfo.length;
      singleDimension = dimensionCount === 1;
      singleMeasure = measureCount === 1;

      dataKeys = qData.qMatrix.map((d) => d[0].qText);

      setData(
        qData.qMatrix.map((d) => ({
          label: d[0].qText,
          value: d[1].qNum,
          selectionId: d[0].qElemNumber,
          percent:
            (d[1].qNum / qLayout.qHyperCube.qGrandTotalRow[0].qNum) * 100,
        }))
      );
    }
  }, [qData]);

  return (
    <>
      {data && qLayout && !dataError ? (
        <PieWrapper
          border={border}
          backgroundColor={backgroundColor}
          borderRadius={borderRadius}
          margin={margin || chart.margin}
          gridArea={gridArea}
          width={width}
          showBoxShadow={valueIfUndefined(
            showBoxShadow,
            chart.wrapper.showBoxShadow
          )}
          ref={ref}
        >
          <div>
            <CreatePie
              // width={width}
              // height={height}
              width={
                gridArea
                  ? ref.current.offsetWidth
                  : parseInt(width, 10) - parseInt(refMargin, 10) * 2 // Adjust for outside padding
              }
              height={
                gridArea
                  ? ref.current.offsetHeight -
                    parseInt(margin || chart.margin, 10)
                  : parseInt(height, 10)
              }
              events={events || chart.events}
              qLayout={qLayout}
              theme={theme}
              singleDimension={singleDimension}
              singleMeasure={singleMeasure}
              // measureCount={measureCount}
              // dimensionCount={dimensionCount}
              data={data}
              dataKeys={dataKeys}
              beginSelections={beginSelections}
              select={select}
              setCurrentSelectionIds={setCurrentSelectionIds}
              currentSelectionIds={currentSelectionIds}
              colorPalette={colorPalette}
              size={size}
              type={type}
              showLegend={valueIfUndefined(showLegend, chart.showLegend)}
              backgroundStyle={backgroundStyle || chart.backgroundStyles}
              multiColor={valueIfUndefined(multiColor, chart.multiColor)}
              selectionMethod={valueIfUndefined(
                selectionMethod,
                chart.selectionMethod
              )}
              showAsPercent={showAsPercent}
              {...rest}
            />
            <SelectionModal
              isOpen={!isEmpty(currentSelectionIds)}
              cancelCallback={cancelCallback}
              confirmCallback={confirmCallback}
              offsetX={0}
              // width={width}
            />
          </div>
        </PieWrapper>
      ) : (
        <PieWrapperNoData
          border={border}
          size={size}
          margin={margin || chart.margin}
          // height={
          //   gridArea
          //     ? ref.current.offsetHeight -
          //       parseInt(margin || chart.margin, 10)
          //     : parseInt(height, 10)
          // }
          gridArea={gridArea}
          width={width}
        >
          <PieNoDataContent height={height}>
            {calcCond || dataError || engineError || <Spinner />}
          </PieNoDataContent>
        </PieWrapperNoData>
      )}
    </>
  );
}

export default StyledPie;
