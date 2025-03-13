import '../../App.css'
import './inventory.css'
import CreatableSelect from 'react-select/creatable'
import {useState} from 'react'

export default function InvStall(){
    const sampleLocation = [
        { value: "NCCC", label: "NCCC" },
        { value: "SM Ecoland", label: "SM Ecoland" },
        { value: "Gmall Bajada", label: "Gmall Bajada" }
    ]

    const [location, setSelectedLocation] = useState(null);
    const [records, setRecords] = useState([])
    const [columns, setColumns] = useState([])
    
    return(
        <div className="content">
            
            <div className="inventory-form-container">
                <div><h2>Stalls Inventory</h2></div>
                <div className="inventory-form">
                    <div>
                        <input
                            className="selection"
                            value={location}
                            onChange={setSelectedLocation}
                            isClearable
                            placeholder="Location"
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