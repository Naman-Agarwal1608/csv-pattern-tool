import React, { useMemo, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { ExcelExportModule } from "@ag-grid-enterprise/excel-export";

const TableView = ({ data, str, download }) => {
  const gridRef = useRef(null);

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

  const onGridReady = (params) => {
    gridRef.current = params.api;
  };

  const dlCSV = () => {
    gridRef.current.exportDataAsCsv();
  };

  const dlExcel = () => {
    gridRef.current.exportDataAsExcel();
  };

  return (
    <div className="my-3" style={{ height: "500px", width: "100%" }}>
      <h4 className="mb-2">Table Data [{str}]:</h4>
      <div
        style={{ height: "80%", width: "100%" }}
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
          paginationPageSize={[10, 25, 50, 100]}
          rowBuffer={10}
          onGridReady={onGridReady}
          modules={[ExcelExportModule]}
        />
      </div>
      {download && (
        <div className="my-2">
          <button className="btn btn-success btn-sm" onClick={dlCSV}>
            Download as CSV
          </button>
          <button className="btn btn-success btn-sm mx-2" onClick={dlExcel}>
            Download as Excel
          </button>
        </div>
      )}
    </div>
  );
};

export default TableView;
