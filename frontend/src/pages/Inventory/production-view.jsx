import '../../App.css'
import './inventory.css'
import {useState, useEffect} from "react"
import { viewInventory } from '../../utils/api'

export default function InvProduction(){


    const [getSelected, setSelected] = useState(null)

    const product = [
        { value: "Chicharon 1", label: "Chicharon 1" }
    ]

    const [selectedProd, setSelectedProd] = useState(null)

    const [selectedDate, setSelectedDate] = useState(null)

    const [records, setRecords] = useState([])
    const [columns, setColumns] = useState([])
    useEffect(() => {
        async function loadInventory() {
            let table = []
            table = await viewInventory()
            if (table.length > 0) { 
                setRecords(table)
                setColumns(Object.keys(table[0]))
            } else {
                setRecords([])
                setColumns([])
            }
        }
        loadInventory()
    }, [])

    return(
        <>
            <div className="content">
                
                <div className="inventory-form-container">
                    <div><h2>Production Inventory</h2></div>
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
        </>
        
    )
}