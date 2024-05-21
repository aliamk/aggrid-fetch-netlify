import React, { useState, useEffect, useMemo, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-balham.css';
import axios from 'axios';

const TableComponent = () => {
  const [rowData, setRowData] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  const gridRef = useRef();

  const columnDefs = useMemo(() => [
    { headerName: 'Name', field: 'name' },
    { headerName: 'General Partners', field: 'generalPartners', chartDataType: 'category' },
    { headerName: 'Asset Class', field: 'assetClass', chartDataType: 'category' },
    { headerName: 'Status', field: 'status', chartDataType: 'category' },
    { headerName: 'Latest Event', field: 'latestEvent', chartDataType: 'category' },
    { headerName: 'Latest Event Date', field: 'latestEventDate', chartDataType: 'category' },
    { headerName: 'Currency', field: 'currency', chartDataType: 'category' },
    { headerName: 'Initial Target Size Local', field: 'initialTargetSizeLocal', chartDataType: 'series' },
    { headerName: 'Initial Target Size USD', field: 'initialTargetSizeUSD', chartDataType: 'series' },
    { headerName: 'Target Size Local', field: 'targetSizeLocal', chartDataType: 'series' },
    { headerName: 'Target Size Local USD', field: 'targetSizeUSD', chartDataType: 'series' },
    { headerName: 'Hard Cap Local', field: 'hardCapLocal', chartDataType: 'series' },
    { headerName: 'Hard Cap Local USD', field: 'hardCapLocalUSD', chartDataType: 'series' },
    { headerName: 'Target Net IRR Minimum', field: 'targetNetIRRMinimum', chartDataType: 'series' },
  ], []);

  const defaultColDef = {
    filter: true,
    floatingFilter: true,
    minWidth: 100,
    enableRowGroup: true,
  };

 useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch token
        const tokenResponse = await axios.post('https://api.realfin.com/api/token', {
          username: process.env.REACT_APP_API_USERNAME,
          password: process.env.REACT_APP_API_PASSWORD
        });
        const token = tokenResponse.data.token;

        // Fetch funds data
        const allFunds = [];
        let currentPage = 1;
        let totalPages = 1; // Start with at least one page to fetch
        while (currentPage <= totalPages) {
          const fundsResponse = await axios.get(`https://api.realfin.com/api/funds?page=${currentPage}&limit=200`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          allFunds.push(...fundsResponse.data.funds);
          totalPages = fundsResponse.data.totalPages;
          currentPage++;
        }
        setRowData(allFunds);
      } catch (error) {
        console.error('Error fetching data:', error);
        setRowData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="ag-theme-balham" style={{ height: '800px', width: '100%', margin: 'auto' }}>
      <AgGridReact
        ref={gridRef}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        rowData={rowData}
        pagination={true}
        paginationPageSize={200} // Display 200 items per page
        suppressCellSelection={true}
        loading={loading}
      />
    </div>
  );
};

export default TableComponent;
