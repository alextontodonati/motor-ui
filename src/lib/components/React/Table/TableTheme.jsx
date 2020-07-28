import styled, { css } from 'styled-components'
import { defaultProps } from '../../../default-props'
import { globalStyle } from '../../../utils/styles'
import { selectColor } from '../../../utils/colors'

const handleTableCellStyle = props => {
  const {
    item, col, selCol, selectionsActive, pendingSel,
  } = props

  // conditional background color
  const bkgColor = item.qAttrExps.qValues[0].qText
  // conditional text color
  const textColor = item.qAttrExps.qValues[1].qText
  // select Bkg color
  const selBkgColor = selectColor(
    props.theme.table.color.selectedBackground,
    props.theme,
  )

  if (selectionsActive) {
    const selected = pendingSel.includes(item.qElemNumber)
    if (col.id !== selCol) {
      return css`
        color: ${selectColor(props.theme.global.color.fontAlt, props.theme)};
      `
    }
    if (selected) {
      return css`
        font-weight: ${props => (props.highlightOnSelection ? null : 'bold')};
        background-color: ${props => (props.highlightOnSelection ? `${selBkgColor} !important` : null)};
        opacity: ${props => (props.highlightOnSelection ? 0.8 : null)};
        color: ${props => (props.highlightOnSelection
    ? `${props.theme.table.color.selectedFont} !important`
    : `${props.theme.global.color.font}`)};
      `
    }
  }

  return css`
  background-color: ${bkgColor} !important;
  color: ${textColor} !important;
  `
}

const TableWrapper = styled.div`
  ${globalStyle};
  height: ${props => props.height};
  width: ${props => props.wrapperWidth};
  position: relative;
  overflow: auto;
  padding-bottom: 10px;
`
const TableWrapperNoData = styled.div`
  ${globalStyle};
  height: ${props => props.height};
  width: ${props => props.wrapperWidth};
  display: ${props => props.theme.global.chart.noData.display};
  align-items: ${props => props.theme.global.chart.noData.alignItems};
  justify-content: ${props => props.theme.global.chart.noData.justifyContent};
  background-color: ${props => props.theme.global.chart.noData.backgroundColor};
  border-collapse: ${props => props.theme.global.chart.noData.borderCollapse};
`

const TableOutline = styled.table`
  cursor: pointer;
    "-webkit-user-select": "none",
    "-khtml-user-select": "none",
    "-moz-user-select": "none",
    "-ms-user-select": "none",
    "user-select": "none",
  table-layout: ${props => props.tableLayout};
  width: ${props => props.tableWidth};
  position: relative;
  z-index: 1;
  border-collapse: seperate;
  border-spacing: 0;
  color: ${props => selectColor(props.theme.global.color.font, props.theme)};
`

const HeaderRow = styled.tr`
  & th:first-child {
    border-left: ${props => `${props.gridPxl} solid ${selectColor(
    props.theme.table.wrapper.borderColor,
    props.theme,
  )}`};
  }
  & th {
    border-top: ${props => `1px solid ${selectColor(
    props.theme.table.wrapper.borderColor,
    props.theme,
  )}`};
    border-bottom: ${props => `1px solid ${selectColor(
    props.theme.table.header.borderColor,
    props.theme,
  )}`};
    border-right: ${props => `${props.gridPxl} solid ${selectColor(
    props.theme.table.cells.borderColor,
    props.theme,
  )}`};
  }
  & th:last-child {
    border-right: ${props => `${props.gridPxl} solid ${selectColor(
    props.theme.table.wrapper.borderColor,
    props.theme,
  )}`};
  }
`

const HeaderCell = styled.th`
  background-color: ${props => selectColor(
    props.headerBackgroundColor || props.theme.table.color.headerBackground,
    props.theme,
  )};
  text-align: ${props => props.headerAlignment};
  padding: ${props => props.theme.table.header.padding};
  color: ${props => selectColor(
    props.headerFontColor || props.theme.global.color.font,
    props.theme,
  )};
  position: sticky;
  top: 0;
  z-index: 5;
`

const GrandTotalsRow = styled.tr`
  & th:first-child {
    border-left: ${props => `${props.gridPxl} solid ${selectColor(
    props.theme.table.wrapper.borderColor,
    props.theme,
  )}`};
  }
  & th {
    border-bottom: ${props => `1px solid ${selectColor(
    props.theme.table.totals.borderColor,
    props.theme,
  )}`};
    border-right: ${props => `${props.gridPxl} solid ${selectColor(
    props.theme.table.cells.borderColor,
    props.theme,
  )}`};
  }
  & th:last-child {
    border-right: ${props => `${props.gridPxl} solid ${selectColor(
    props.theme.table.wrapper.borderColor,
    props.theme,
  )}`};
  }
`

const GrandTotalsCell = styled.th`
  position: sticky;
  top: ${props => `${props.offsetTop}px`};
  background-color: ${props => selectColor(props.theme.table.color.headerBackground, props.theme)};
  z-index: 4;
  text-align: left;
  padding: ${props => props.theme.table.totals.padding};
`

const TableBodyStyle = styled.tbody`
  position: relative;
  & tr:nth-last-child(2) td {
    border-bottom: ${props => `${props.gridPxl} solid ${selectColor(
    props.theme.table.wrapper.borderColor,
    props.theme,
  )}`};
  }
`

const TableRowStyle = styled.tr`
  & td:first-child {
    border-left: ${props => `${props.gridPxl} solid ${selectColor(
    props.theme.table.wrapper.borderColor,
    props.theme,
  )}`};
  }
  & td {
    background-color: ${props => {
    if (props.bandedRows === true) {
      return props.i % 2 === 1
        ? selectColor(props.theme.table.color.evenRows, props.theme)
        : selectColor(props.theme.table.color.oddRows, props.theme)
    }

    return selectColor(props.theme.table.color.bodyBackground, props.theme)
  }};
    border-bottom: ${props => `${props.gridPxl} solid ${selectColor(
    props.theme.table.cells.borderColor,
    props.theme,
  )}`};
    border-right: ${props => `${props.gridPxl} solid ${selectColor(
    props.theme.table.cells.borderColor,
    props.theme,
  )}`};
  }
  & td:last-child {
    border-right: ${props => `${props.gridPxl} solid ${selectColor(
    props.theme.table.wrapper.borderColor,
    props.theme,
  )}`};
  }
  &:hover {
    background-color: ${props => `${props.gridPxl} solid ${selectColor(
    props.theme.table.color.hover,
    props.theme,
  )}`};
  }
`

const TableCellStyle = styled.td`
  border-top: ${props => props.theme.table.cells.borderTop};
  border-bottom: ${props => props.theme.table.cells.borderBottom};
  border-left: ${props => props.theme.table.cells.borderLeft};
  border-right: ${props => props.theme.table.cells.borderRight};
  padding: ${props => props.theme.table.cells.padding};
  ${props => handleTableCellStyle(props)};
  width: ${props => props.col.width};
`

const DropMenu = css`
  font-size: 14px;
  cursor: pointer;
  padding: 8px 12px;
  border: 1px solid grey;
  background-color: white;
  border-radius: 2px;
  z-index: 500;

  &:hover {
    background-color: grey;
  }
`

TableWrapper.defaultProps = {}
Object.setPrototypeOf(TableWrapper.defaultProps, defaultProps)

TableWrapperNoData.defaultProps = {}
Object.setPrototypeOf(TableWrapperNoData.defaultProps, defaultProps)

TableOutline.defaultProps = {}
Object.setPrototypeOf(TableOutline.defaultProps, defaultProps)

HeaderRow.defaultProps = {}
Object.setPrototypeOf(HeaderRow.defaultProps, defaultProps)

HeaderCell.defaultProps = {}
Object.setPrototypeOf(HeaderCell.defaultProps, defaultProps)

GrandTotalsCell.defaultProps = {}
Object.setPrototypeOf(GrandTotalsCell.defaultProps, defaultProps)

GrandTotalsRow.defaultProps = {}
Object.setPrototypeOf(GrandTotalsRow.defaultProps, defaultProps)

TableBodyStyle.defaultProps = {}
Object.setPrototypeOf(TableBodyStyle.defaultProps, defaultProps)

TableRowStyle.defaultProps = {}
Object.setPrototypeOf(TableRowStyle.defaultProps, defaultProps)

TableCellStyle.defaultProps = {}
Object.setPrototypeOf(TableCellStyle.defaultProps, defaultProps)

export {
  TableWrapper,
  TableWrapperNoData,
  TableOutline,
  HeaderRow,
  HeaderCell,
  GrandTotalsCell,
  GrandTotalsRow,
  TableBodyStyle,
  TableRowStyle,
  TableCellStyle,
  DropMenu,
}
