import React from "react";
import { Column, Table, AutoSizer } from "react-virtualized";
import "react-virtualized/styles.css";
import "./TableView.css";

const TableView = ({ data }) => {
  if (!data || data.length === 0) {
    return null;
  }

  const columns = Object.keys(data[0]);

  return (
    <div className="my-3">
      <h4>Table Data:</h4>
      <div
        style={{ height: "400px", width: "100%" }}
        className="virtualizedTable"
      >
        <AutoSizer>
          {({ height, width }) => (
            <Table
              width={width}
              height={height}
              headerHeight={40}
              rowHeight={30}
              rowCount={data.length}
              rowGetter={({ index }) => data[index]}
            >
              {columns.map((key) => (
                <Column
                  key={key}
                  label={key}
                  dataKey={key}
                  width={width / columns.length}
                />
              ))}
            </Table>
          )}
        </AutoSizer>
      </div>
    </div>
  );
};

export default TableView;
