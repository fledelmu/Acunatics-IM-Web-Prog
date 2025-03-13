import '../../App.css'
import './inventory.css'
import {useState} from 'react'

export default function InvStall(){
    const [item, setItem] = useState("");
    const [records, setRecords] = useState([])
    const [columns, setColumns] = useState([])
    
    return(
        <div className="content">
            
            <div className="inventory-form-container">
                <div><h2>Supply Inventory</h2></div>
                <div className="inventory-form">
                    <div>
                        <input
                            className="selection"
                            value={item}
                            onChange={setItem}
                            isClearable
                            placeholder="Enter item..."
                        />
                    </div>
                    <button className="input-button">Search</button>
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
                                    <div><h1>No records found</h1></div>
                                ) : (
                                    records.map((record, rowIndex) => (
                                        <div className="table-row" key={rowIndex}>
                                            {columns.map((col, colIndex) => (
                                                <div key={colIndex}>{record[col] || "N/A"}</div>
                                            ))}
                                        </div>
                                    ))
                                )}
                                
                            </>
                        )}
                    </div>
            </div>
        </div>
    )
}