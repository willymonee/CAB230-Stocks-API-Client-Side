import React, { useState, useEffect, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";
import { useParams } from 'react-router-dom';
import Chartjs from 'chart.js';

 function QuoteTable(){
    const [rowData, setRowData] = useState([]);
    const [error, setError] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [industry, setIndustry] = useState("");
    const[name, setName] = useState("");
    const { symbol } = useParams();
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [labelDate, setLabelDate] = useState([]);
    const [openData, setOpenData] = useState([]);
    const [closeData, setCloseData] = useState([]);
    const [highData, setHighData] = useState([]);
    const [lowData, setLowData] = useState([]);
    let token = localStorage.getItem("token");
 
    useEffect(() => {
        //NOT LOGGED IN
        if (localStorage.getItem("token") === null) {
            fetch("http://131.181.190.87:3000/stocks/" + symbol)
            .then(handleErrors)
            .then(res => res.json())
            .then(data => {
                let date = data.timestamp.substring(0, 10);
                let symbolData = [{
                    timestamp: date,
                    open: data.open,
                    high: data.high,
                    low: data.low,
                    close: data.close,
                    volumes: data.volumes
                }]
                setRowData(symbolData);
                setIndustry(data.industry);
                setName(data.name);
                });    
        }
        //LOGGED IN BUT NO DATES SELECTED YET
        else {
            fetch(`http://131.181.190.87:3000/stocks/authed/${symbol}`, {
                headers: {
                    accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                }
            })
            .then(handleDateErrors)
            .then(res => res.json())
            .then(data => {
                let date = data.timestamp.substring(0, 10);
                let symbolData = [{
                    timestamp: date,
                    open: data.open,
                    high: data.high,
                    low: data.low,
                    close: data.close,
                    volumes: data.volumes
                }]
                setRowData(symbolData);
                setIndustry(data.industry);
                setName(data.name);
             });  
        }           
      }, [symbol]);
    
    function handleErrors(response) {
    if (response.status === 404) {
        setError(true);
        setErrorMessage("Symbol not found");
        throw response; 
    }
    else if (response.status === 400){
        setError(true);
        setErrorMessage("Invalid query parameter: only 'symbol' is permitted.");
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

    useEffect(() => {
        //LOGGED IN BUT USER HAS SELECTED 2 EMPTY DATES 
        if (fromDate === "from=" && toDate === "to=")
        {
            fetch(`http://131.181.190.87:3000/stocks/authed/${symbol}`, {
                headers: {
                    accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                }
            })
            .then(handleDateErrors)
            .then(res => res.json())
            .then(data => {
                let date = data.timestamp.substring(0, 10);
                let symbolData = [{
                    timestamp: date,
                    open: data.open,
                    high: data.high,
                    low: data.low,
                    close: data.close,
                    volumes: data.volumes
                }]
                setRowData(symbolData);
                setIndustry(data.industry);
                setName(data.name);
            });  
        }  
        //LOGGED IN AND USER SELECTED AT LEAST 1 DATE
        else if (fromDate !== "" || toDate !== "") {
            let dateArray = [];
            let openArray = [];
            let closeArray = [];
            let highArray = [];
            let lowArray = [];
            fetch(`http://131.181.190.87:3000/stocks/authed/${symbol}?${fromDate}&${toDate}`, {
                headers: {
                    accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                }
            })
            .then(handleDateErrors)
            .then(res => res.json())
            //reverse the data so that it returns by date in ascending order
            .then(data => data.reverse())
            .then(data =>
                data.map(stock => {
                    let date = stock.timestamp.substring(0, 10);
                    dateArray.push(date);
                    openArray.push(stock.open);
                    closeArray.push(stock.close);
                    highArray.push(stock.high);
                    lowArray.push(stock.low);
                    return {
                        timestamp: date,
                        open: stock.open,
                        high: stock.high,
                        low: stock.low,
                        close: stock.close,
                        volumes: stock.volumes,
                    };
                })
            )        
            .then(stock => setRowData(stock)); 
            setCloseData(closeArray);
            setLabelDate(dateArray);
            setOpenData(openArray);
            setHighData(highArray);
            setLowData(lowArray);
            }
    }, [toDate, fromDate, symbol]);

    function handleDateErrors(response) {
        if (response.status === 404) {
            setError(true);
            setErrorMessage("No entries available for query symbol for supplied date range");
            throw response; 
        }
        else if (response.status === 400){
            setError(true);
            setErrorMessage("Parameters allowed are 'from' and 'to', example: /stocks/authed/AAL?from=2020-03-15");
            throw response;
        }
        else if (response.status === 403) {
            setError(true);
            setErrorMessage("Access denied, authorization header not found")
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

    const chartConfig = {
        type: 'line',
        data: {
            labels: labelDate,
            datasets: [
                {
                    label: "open",
                    data: openData,
                    borderColor: "#bae755",
                    pointColor: "#bae755",
                    fill: false
                },
                {
                    label: "close",
                    data: closeData,
                    borderColor: "#f56c42",
                    pointColor: "#f56c42",
                    fill: false
                },
                {
                    label: "high",
                    data: highData,
                    borderColor: "#f0161d",
                    pointColor: "#f0161d",
                    fill: false
                },
                {
                    label: "low",
                    data: lowData,
                    borderColor: "#406bf7",
                    pointColor: "#406bf7",
                    fill: false
                }
            ]     
        },
    };

    const Chart = () => {
        const chartContainer = useRef(null);
        useEffect(() => {
            if (chartContainer && chartContainer.current) {
                const newChartInstance = new Chartjs(chartContainer.current, chartConfig);
            }
        }, [chartContainer]);
        return (
            <div>
                <canvas ref={chartContainer} />
            </div>
        )
    }

    const columns = [
        { headerName: "Date", field: "timestamp", sortable: true, width: 200},
        { headerName: "Open", field: "open", sortable: true, width: 100},
        { headerName: "High", field: "high", sortable: true, width: 100},
        { headerName: "Low", field: "low", sortable: true, width: 100},
        { headerName: "Close", field: "close", sortable: true, width: 100},
        { headerName: "Volumes", field: "volumes", sortable: true, width: 150},
    ];

    return (
        <div> 
            {error 
              ? <p>{errorMessage}</p>
              : <div>
                    <p><strong>Company</strong>: {name} ({symbol})</p>
                    <p><strong>Industry</strong>: {industry}</p>
                </div>    
            }
            {token === null
              ? <p>Login to gain access to price history (select stocks from date range)</p>
              : <form
                    onSubmit={event => {
                        event.preventDefault();
                        const unformattedToDate = event.target.elements.to.value;
                        const unformattedFromDate = event.target.elements.from.value;
                        const formattedToDate = unformattedToDate.toString().split("/").reverse().join("-");
                        const formattedFromDate = unformattedFromDate.toString().split("/").reverse().join("-");
                        const from = "from=";
                        const to = "to="
                        const joinedFromDate = from.concat(formattedFromDate);
                        const joinedToDate = to.concat(formattedToDate);
                        setToDate(joinedToDate);
                        setFromDate(joinedFromDate);
                    }
                    }
                  >
                    <p><strong>Select Date</strong></p>
                    <label for="from">From: </label>
                    <input 
                        type="date" 
                        id="from" 
                        name="from" 
                    />
                    <label for="to">To: </label>
                    <input 
                        type="date" 
                        id="to" 
                        name="to" 
                        />
                    <input type="submit" />
                  </form>
            }
        <div
            className="ag-theme-balham"
            style={{
            height: "500px",
            width: "750px"
        }}
        >
            <AgGridReact
                columnDefs={columns}
                rowData={rowData}
                pagination={true}
                paginationPageSize={15}
            /> 
        </div>
        {(fromDate !== "" || toDate !== "") && (fromDate !== "from=" || toDate !== "to=") && !error
          ? <Chart /> 
          : null
        }
    </div>
    )
}
export default QuoteTable;