import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import axios from 'axios';

import { AgGridReact } from 'ag-grid-react';
import "ag-grid-enterprise"
import "ag-grid-charts-enterprise";

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-balham.css';
import "ag-grid-community/styles/ag-theme-quartz.css";

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

const enableCharts = true;
const enableRangeSelection = true;

const TableComponent1 = () => {
  const [rowData, setRowData] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const tokenRef = useRef(null); // Store the token

  const gridRef = useRef();

  const columnDefs = useMemo(() => [
        { headerName: 'Name', field: 'name' },
        { headerName: 'General Partners', field: 'generalPartners', chartDataType: 'category' },
        { headerName: 'Asset Class', field: 'assetClass', chartDataType: 'category' },
        { headerName: 'Fund Status', field: 'status', chartDataType: 'category' },
        { headerName: 'Latest Event', field: 'latestEvent', chartDataType: 'category' },
        { headerName: 'Latest Event Date', field: 'latestEventDate', chartDataType: 'category' },
        { headerName: 'Initial Target Size USD', field: 'initialTargetSizeUSD', chartDataType: 'series' },
        { headerName: 'Hard Cap Local USD', field: 'hardCapLocalUSD', chartDataType: 'series' },
        { headerName: 'Fund Launch Date', field: 'launchDate', chartDataType: 'series' },
        { headerName: 'Latest Interim Close (m)', field: 'latestInterimCloseUSD', chartDataType: 'series' },
        { headerName: 'Vintage Year', field: 'vintageYear', chartDataType: 'series' },
        { headerName: 'Final Size (m)', field: 'finalSizeUSD', chartDataType: 'series' },
        { headerName: 'Final Close Date', field: 'finalCloseEventDate', chartDataType: 'series' },
        { headerName: 'Time to First Close', field: 'timeToFirstClose', chartDataType: 'series' },
        { headerName: 'Fund Style', field: 'style', chartDataType: 'category' },
        { headerName: 'Main Target Sector', field: 'targetSectorsMain', chartDataType: 'category' },
        { headerName: 'Fund Structure', field: 'structure', chartDataType: 'category' },
        { headerName: 'Open/Closed', field: 'openClosed', chartDataType: 'category' },
        { headerName: 'Fund Life(Years)', field: 'life', chartDataType: 'category' },
        { headerName: 'Extension Provision Length', field: 'extensionProvisions', chartDataType: 'category' },
        { headerName: 'Valuation Regularity', field: 'valuationRegularity', chartDataType: 'category' },
        { headerName: 'Limited Partners', field: 'limitedPartners', chartDataType: 'category' },
        { headerName: 'Legal Advisers', field: 'legalAdvisers', chartDataType: 'category' },
        { headerName: 'Auditors', field: 'auditors', chartDataType: 'category' },
        { headerName: 'Administrators', field: 'administrators', chartDataType: 'category' },

  ], []);

  const defaultColDef = {
    filter: true,
    floatingFilter: true,
    minWidth: 100,
    enableRowGroup: true,
    rowGroupPanelShow: true,
  };

  const fetchFunds = useCallback(async (page) => {
    setLoading(true);
    try {
      if (!tokenRef.current) {
        // Fetch token only once
        const tokenResponse = await axios.post('https://api.realfin.com/api/token', {
          username: process.env.REACT_APP_API_USERNAME,
          password: process.env.REACT_APP_API_PASSWORD
        });
        tokenRef.current = tokenResponse.data.token;
      }

      // Fetch funds data for the specified page
      const fundsResponse = await axios.get(`https://api.realfin.com/api/funds?page=${page}&limit=200`, {
        headers: { Authorization: `Bearer ${tokenRef.current}` }
      });

      if (page === 1) {
        setRowData(fundsResponse.data.funds);
      } else {
        setRowData((prevData) => [...prevData, ...fundsResponse.data.funds]);
      }
      setTotalPages(fundsResponse.data.totalPages);
    } catch (error) {
      console.error('Error fetching data:', error);
      setRowData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFunds(1);
  }, [fetchFunds]);

  const onPaginationChanged = () => {
    const gridApi = gridRef.current.api;
    const newPage = gridApi.paginationGetCurrentPage() + 1;
    if (newPage > currentPage && newPage <= totalPages) {
      setCurrentPage(newPage);
      fetchFunds(newPage);
    }
  };

  return (
    <div className="ag-theme-quartz-dark" style={{ height: 800, marginTop: 10, marginRight: 40, marginBottom: 80, marginLeft: 40, textAlign: 'left'  }}>
      <AgGridReact
        ref={gridRef}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        rowData={rowData}
        rowGroupPanelShow={"always"}
        enableCharts={enableCharts}
        enableRangeSelection={enableRangeSelection}
        pagination={true}
        paginationPageSize={200}
        suppressCellSelection={false}
        onPaginationChanged={onPaginationChanged}
        modules={[ClientSideRowModelModule, MenuModule, RowGroupingModule, ColumnsToolPanelModule, GridChartsModule, RangeSelectionModule]}
        loadingOverlayComponentParams={{ loadingMessage: 'Please wait while data is loading...' }}
        overlayLoadingTemplate='<span class="ag-overlay-loading-center">Please wait while data is loading...</span>'
      />
    </div>
  );
};

export default TableComponent1;
