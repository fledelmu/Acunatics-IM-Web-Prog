import '../../App.css'
import './inventory.css'
import {useState, useEffect} from 'react'
import {viewInventoryStalls} from '../../utils/api'

export default function InvStall(){
    const [records, setRecords] = useState([])
    const [columns, setColumns] = useState([])
    
    useEffect(() => {
        async function loadSupply() {
            let table = []
            table = await viewInventoryStalls()
            if (table.length > 0) { 
                setRecords(table)
                setColumns(Object.keys(table[0]))
            } else {
                setRecords([])
                setColumns([])
            }
        }
        loadSupply()
    },[])

    return(
        <div className="content">
            
            <div className="inventory-form-container">
                <div><h2>Supply Inventory</h2></div>
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