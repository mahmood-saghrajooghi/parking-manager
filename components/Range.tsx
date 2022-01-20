import _ from "lodash";
import React, { useCallback, useEffect, useRef, useState } from "react";
import GridLayout, { Layout } from "react-grid-layout";
import { sleep } from "../utils/sleep";

interface RangeTypes {
  invalidAreas?: { width: number; left: number; id: string }[];
  onChange: (layout: Layout) => any;
}

function isOdd(n: number) {
  return n % 2 !== 0;
}

export const Range: React.FC<RangeTypes> = ({
  children,
  invalidAreas,
  onChange,
}) => {
  const gridContainer = useRef<HTMLDivElement>(null);
  const [text, setText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const toggleLoading = useCallback(async (areas) => {
    if (areas) {
      await sleep(1000);
      return setLoading(false);
    }
    return setLoading(true);
  }, []);
  useEffect(() => {
    toggleLoading(invalidAreas);
  }, [invalidAreas]);

  const onLayoutChange = useCallback((layout: Layout[]) => {
    const currentGridItem = _.find(layout, { i: "variable-item" });
    if (!currentGridItem) {
      return console.error(
        "[Range:onLayoutChange] 'currentGridItem' not found!"
      );
    }
    onChange(currentGridItem);
    const from = Math.floor(currentGridItem.x / 2);
    const until = from + Math.floor(currentGridItem.w / 2);
    setText(
      `${from < 10 ? "0" : ""}${from}:${isOdd(from) ? "30" : "00"} - ${
        until < 10 ? "0" : ""
      }${until}:${isOdd(until) ? "30" : "00"}`
    );
  }, []);

  return (
    <div className="relative h-10 flex items-center justify-center p-2.5">
      <div className="absolute left-0 top-0 w-full h-full border rounded border-gray-600"></div>
      <div
        className="absolute w-full h-full z-10"
        dir="ltr"
        ref={gridContainer}
      >
        {loading ? null : (
          <GridLayout
            className="layout "
            cols={48}
            maxRows={1}
            isBounded
            rowHeight={20}
            width={gridContainer.current?.clientWidth}
            onLayoutChange={onLayoutChange}
            onDragStop={() => {}}
            resizeHandles={["e", "w"]}
            margin={[5, 10]}
          >
            {invalidAreas?.map((area) => (
              <div
                key={area.id}
                className="rounded bg-red-500"
                data-grid={{
                  i: area.id,
                  x: (area.left * 48) / 100,
                  y: 0,
                  w: (area.width * 48) / 100,
                  h: 1,
                  minH: 1,
                  maxH: 1,
                  static: true,
                }}
              ></div>
            ))}
            <div
              key="variable-item"
              className="relative rounded bg-blue-500 overflow-hidden text-center "
              dir="ltr"
              data-grid={{
                i: "variable-item",
                x: 0,
                y: 0,
                w: 10,
                h: 1,
                minH: 1,
                maxH: 1,
              }}
            >
              <div className="absolute font-sans text-xs flex items-center justify-center cursor-default">
                {text}
              </div>
            </div>
          </GridLayout>
        )}
      </div>
    </div>
  );
};
