import axios from 'axios';

import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the grid

import "ag-grid-enterprise"
import "ag-grid-charts-enterprise";

import { ModuleRegistry } from "@ag-grid-community/core";

import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { MenuModule } from '@ag-grid-enterprise/menu';
import { RowGroupingModule } from '@ag-grid-enterprise/row-grouping';
import { ColumnsToolPanelModule } from 'ag-grid-enterprise';
import { MultiFilterModule } from '@ag-grid-enterprise/multi-filter';
import { GridChartsModule } from '@ag-grid-enterprise/charts';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';

// Register modules
ModuleRegistry.registerModules([ClientSideRowModelModule, MenuModule, RowGroupingModule, ColumnsToolPanelModule, MultiFilterModule, GridChartsModule]);


const enableCharts = true;
const enableRangeSelection = true;

const TableComponent5 = () => {
    const gridRef = useRef();

    const [rowData, setRowData] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const tokenRef = useRef(null); 

    const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
    const gridStyle = useMemo(() => ({ height: 500, marginLeft: 20, marginRight: 20 }), []);

       /* Column Definitions: Defines the columns to be displayed. */
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
        { headerName: 'Fund Style', field: 'style', chartDataType: 'series' },
        { headerName: 'Main Target Sector', field: 'targetSectorsMain', chartDataType: 'series' },
        { headerName: 'Fund Structure', field: 'structure', chartDataType: 'series' },
        { headerName: 'Open/Closed', field: 'openClosed', chartDataType: 'series' },
        { headerName: 'Fund Life(Years)', field: 'life', chartDataType: 'series' },
        { headerName: 'Extension Provision Length', field: 'extensionProvisions', chartDataType: 'series' },
        { headerName: 'Valuation Regularity', field: 'valuationRegularity', chartDataType: 'series' },
        { headerName: 'Limited Partners', field: 'limitedPartners', chartDataType: 'series' },
        { headerName: 'Legal Advisers', field: 'legalAdvisers', chartDataType: 'series' },
        { headerName: 'Auditors', field: 'auditors', chartDataType: 'series' },
        { headerName: 'Administrators', field: 'administrators', chartDataType: 'series' },

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
        const tokenResponse = await axios.post('https://api.realfin.com/api/token', {
          username: process.env.REACT_APP_API_USERNAME,
          password: process.env.REACT_APP_API_PASSWORD
        });
        tokenRef.current = tokenResponse.data.token;
      }

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
      <div>
        <div className="ag-theme-quartz-dark" style={{ height: 800, marginTop: 10, marginRight: 40, marginBottom: 80, marginLeft: 40 }}>
        <AgGridReact 
            ref={gridRef} 
            rowGroupPanelShow={"always"} 
            rowData={rowData} 
            columnDefs={columnDefs} 
            defaultColDef={defaultColDef} 
            pagination={true} 
            paginationPageSize={200} 
            onPaginationChanged={onPaginationChanged}
            enableCharts={enableCharts} 
            enableRangeSelection={enableRangeSelection} 
            modules={[ClientSideRowModelModule, MenuModule, RowGroupingModule, ColumnsToolPanelModule]}          
             />
        </div>
      </div>

  );
};

export default TableComponent5;
