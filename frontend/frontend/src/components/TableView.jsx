import React, { useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

const TableView = ({ data, str }) => {
  if (!data || data.length === 0) {
    return null;
  }

  const columns = useMemo(() => {
    return Object.keys(data[0]).map((key) => ({
      headerName: key.charAt(0).toUpperCase() + key.slice(1), // Capitalize header
      field: key,
      sortable: true,
      filter: true,
      resizable: true,
    }));
  }, [data]);

  return (
    <div className="my-3" style={{ height: "500px", width: "100%" }}>
      <h4 className="mb-2">Table Data [{str}]:</h4>
      <div
        style={{ height: "90%", width: "100%" }}
        //className="virtualizedTable"
        className="ag-theme-quartz"
      >
        <AgGridReact
          columnDefs={columns}
          rowData={data}
          defaultColDef={{
            sortable: true,
            filter: true,
            resizable: true,
            flex: 1,
          }}
          domLayout="normal"
          pagination={true}
          paginationPageSize={15}
          rowBuffer={10}
        />
      </div>
    </div>
  );
};

export default TableView;
