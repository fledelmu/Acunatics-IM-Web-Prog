import '../../App.css';
import './process.css';
import { useState, useEffect } from 'react';
import Select from 'react-select';
import {} from '../../utils/api';


export default function StallSales() {
    

    const [records, setRecords] = useState([])
    const [columns, setColumns] = useState([])

    return (
        <div className="content">
            <div><h2>Stalls Report</h2></div>
            <div className="form">
                <div><h3>Add Process:</h3></div>
                <input placeholder="Location..."></input> 
                <input placeholder="Product..."></input>
                <input placeholder="quantity"></input>
                <input placeholder="price..."></input>
                <button className="input-button">Add</button>
            </div>
            <div className="table-container">
                {columns.length === 0 ? (
                    <div>No records found</div>
                ) : (
                    <>
                        <div className='table-header'>
                            {columns.map((col, index) => (
                                <div className="table-data" key={index}>{col}</div>
                            ))}
                        </div>
                        {records.length === 0 ? (
                            <div></div>
                        ) : (
                            records.map((record, rowIndex) => (
                                <div className='table-row' key={rowIndex}>
                                    {columns.map((col, colIndex) => (
                                        <div key={colIndex}>{record[col] || "???"}</div>
                                    ))}
                                </div>
                            ))
                        )}
                    </>
                )}
            </div>
        </div>
    )
}
