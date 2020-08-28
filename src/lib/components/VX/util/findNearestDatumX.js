import findNearestDatumSingleDimension from "./findNearestDatumSingleDimension";
import { NearestDatumArgs } from "../types";

export default function findNearestDatumX({
  xScale: scale,
  xAccessor: accessor,
  svgMouseX: mouseCoord,
  data,
}) {
  const { datum, distance, index } =
    findNearestDatumSingleDimension({
      scale,
      accessor,
      mouseCoord,
      data,
    }) ?? {};
  return datum ? { datum, index, distanceX: distance, distanceY: 0 } : null;
}
