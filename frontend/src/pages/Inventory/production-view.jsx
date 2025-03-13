import '../../App.css'
import './inventory.css'
import {useState} from "react"
import Select from 'react-select'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

export default function InvProduction(){


    const [getSelected, setSelected] = useState(null)

    const product = [
        { value: "Chicharon 1", label: "Chicharon 1" }
    ]

    const [selectedProd, setSelectedProd] = useState(null)

    const [selectedDate, setSelectedDate] = useState(null)

    const [records, setRecords] = useState([])
    const [columns, setColumns] = useState([])
    
    return(
        <>
            <div className="content">
                
                <div className="inventory-form-container">
                    <div><h2>Production Inventory</h2></div>
                    <div className="inventory-form">
                        <div>
                            <input
                            className="selection"
                            options={product}
                            value={selectedProd}
                            onChange={setSelectedProd}
                            placeholder= "Enter product..."
                            />
                        </div>
                        <button className="input-button">Proceed</button>
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
        </>
        
    )
}