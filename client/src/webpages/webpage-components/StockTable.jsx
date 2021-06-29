import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";
import { useHistory } from 'react-router-dom';

const API = "http://131.181.190.87:3000";

export default function StockTable () {
    const [rowData, setRowData] = useState([]);
    const [industry, setIndustry] = useState("");
    const [usingDropDown, setUsingDropDown] = useState(false);
    const [error, setError] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const columns = [
        { headerName: "Name", field: "name", sortable: true, filter: true },
        { headerName: "Symbol", field: "symbol", sortable: true, filter: true},
        { headerName: "Industry", field: "industry", sortable: true},
    ];

    useEffect(() => {
        if (industry === "") {
            fetch(`${API}/stocks/symbols`)
            .then(handleErrors)
            .then(res => res.json())
            .then(data => 
                data.map(stock => {
                    return {
                       name: stock.name,
                        symbol: stock.symbol,
                        industry: stock.industry,
                    };
                })
            )        
            .then(stock => setRowData(stock));    
        }
        else {
            fetch(`${API}/stocks/symbols?industry=${industry}`)
             .then(handleErrors)
             .then(res => res.json())
             .then(data => 
                data.map(stock => {
                    return {
                        name: stock.name,
                        symbol: stock.symbol,
                        industry: stock.industry,
                    };
                })
             )
             .then(stock => setRowData(stock));
        }
    }, [industry]);

    function handleErrors(response) {
        if (response.status === 404) {
            setError(true);
            setErrorMessage("Industry sector not found");
            throw response; 
        }
        else if (response.status === 400){
            setError(true);
            setErrorMessage("Invalid query parameter: only 'industry' is permitted");
            throw response;
        }
        else if (!response.ok){
            setError(true);
            setErrorMessage("An error has occurred");
            throw response;
        }
        else {
            setError(false);
        }
        return response;
    }

    const Dropdown = () => (
        <div>
        <label for="industries">Select industry:</label>
        <select 
            id="industries" 
            name="industries"
            value={industry}
            onChange={event => {
                const { value } = event.target;
                setIndustry(value);
                setUsingDropDown(true);
            }}   
        >
            <option value="">All Industries</option>
            <option value="consumer%20discretionary">Consumer Discretionary</option>
            <option value="consumer%20staples">Consumer Staples</option>
            <option value="energy">Energy</option>
            <option value="financials">Financials</option>
            <option value="health%20care">Health Care</option>
            <option value="industrials">Industrials</option>
            <option value="information%20technology">Information Technology</option>
            <option value="materials">Materials</option>
            <option value="real%20estate">Real Estate</option>
            <option value="Telecommunication%20Services">Telecommunication Services</option>
            <option value="utilities">Utilities</option>
    </select>
    </div>
    )

    function TableLayout() {
        const history = useHistory();
        return (
            <div
            className="ag-theme-balham"
            style={{
            height: "500px",
            width: "600px"
            }}
        >
            <AgGridReact
            columnDefs={columns}
            rowData={rowData}
            pagination={true}
            paginationPageSize={15}
            rowSelection={'single'}
            onRowClicked={row => {
                console.log(row.data.symbol)
                history.push(`/Quote/${row.data.symbol}`)
            }}
            /> 
        </div>
        )
    }

    return (
    <div>
        {error 
        ? (<p>{errorMessage}</p>)
        : (<p>{null}</p>)
        }
        <div>
            <label for="search">Search industry:</label>
            <input 
                aria-labelledby="search-bar"
                name="search"
                id="search"
                type="search"
                autocomplete="off"
                //if dropdown is being used the search bar will clear itself out 
                value=
                    {usingDropDown
                    ? ""
                    : industry
                    }
                onChange={e => {
                    setIndustry(e.target.value);
                    setUsingDropDown(false);
                }}
            />
            <Dropdown />
            <TableLayout />
        </div>
    </div>
    )
}



