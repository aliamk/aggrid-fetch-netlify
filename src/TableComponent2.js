import React, { useMemo, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-balham.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';

import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { MenuModule } from '@ag-grid-enterprise/menu';
import { RowGroupingModule } from '@ag-grid-enterprise/row-grouping';
import { ColumnsToolPanelModule } from '@ag-grid-enterprise/column-tool-panel';
import { GridChartsModule } from '@ag-grid-enterprise/charts-enterprise';
import { RangeSelectionModule } from '@ag-grid-enterprise/range-selection';
import { ModuleRegistry } from '@ag-grid-community/core';

ModuleRegistry.registerModules([
    ClientSideRowModelModule,
    MenuModule,
    RowGroupingModule,
    ColumnsToolPanelModule,
    GridChartsModule,
    RangeSelectionModule,
]);

const TableComponent1 = () => {
  const gridRef = useRef();
  const columnDefs = useMemo(() => [
    { headerName: 'Name', field: 'name' },
    { headerName: 'General Partners', field: 'generalPartners', chartDataType: 'category' },
    { headerName: 'Asset Class', field: 'assetClass', chartDataType: 'series' },
  ], []);

  const rowData = [
    { name: 'Fund A', generalPartners: 'GP A', assetClass: 'Equity' },
    { name: 'Fund B', generalPartners: 'GP B', assetClass: 'Debt' },
  ];

  const defaultColDef = {
    filter: true,
    floatingFilter: true,
    minWidth: 100,
    enableRowGroup: true,
    rowGroupPanelShow: true,
  };

  return (
    <div className="ag-theme-quartz-dark" style={{ height: 500, width: '100%', margin: '10px 40px' }}>
      <AgGridReact
        ref={gridRef}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        rowData={rowData}
        rowGroupPanelShow="always"
        enableCharts={true}
        enableRangeSelection={true}
        pagination={true}
        paginationPageSize={200}
        suppressCellSelection={false}
        modules={[
          ClientSideRowModelModule,
          MenuModule,
          RowGroupingModule,
          ColumnsToolPanelModule,
          GridChartsModule,
          RangeSelectionModule
        ]}
      />
    </div>
  );
};

export default TableComponent1;
