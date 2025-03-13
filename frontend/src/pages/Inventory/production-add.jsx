import '../../App.css'
import './inventory.css'
import {useState} from "react"
import CreatableSelect from 'react-select/creatable'

export default function InvProduction(){
    const [getSelected, setSelected] = useState(null)

    const product = [
        { value: "Chicharon 1", label: "Chicharon 1" }
    ]

    const [selectedProd, setSelectedProd] = useState(null)

    const [records, setRecords] = useState([])
    const [columns, setColumns] = useState([])

    return(
        <>
            <div className="content">
                
                <div className="inventory-form-container">
                    <div><h2>Production Inventory</h2></div>
                    <div className="inventory-form">
                        <div><h3>New Entry</h3></div>

                        <div>
                            <label><h3>Product:</h3></label>
                        </div>
                        <div>
                            <input
                            className="selection"
                            options={product}
                            value={selectedProd}
                            onChange={setSelectedProd}
                            isClearable
                            placeholder= "Product"
                            />
                        </div>
                        <div>
                            <label><h3>Quantity:</h3></label>
                        </div>
                        <div>
                            <input placeholder='Enter quantity'></input>
                        </div>
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