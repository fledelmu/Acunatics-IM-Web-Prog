import '../../App.css'
import './inventory.css'
import {useState} from 'react'
import { viewStallsInv } from '../../utils/api'

export default function InvStall(){
    const [records, setRecords] = useState([])
    const [columns, setColumns] = useState([])
    
    const [stalls, setStalls] = useState('')

    const handleClick = async () => {
                console.log("clicked");
            
                if (!stalls) {
                    console.error("Missing required fields");
                    return;
                }
            
                const data = {
                    location: stalls
                };
            
                console.log("Data being sent:", data); // Debugging
            
                try {
                    const response = await viewStallsInv(data);
                    console.log("Response from API:", response); // Debugging
            
                    setStalls("");
                    console.log("Table data after insert:", response);
                    if (response.length > 0) {
                        setRecords(response);
                        setColumns(Object.keys(response[0]));  
                    } else {
                        setRecords([]);
                        setColumns([]);
                    }
                } catch (error) {
                    console.error("Error executing action:", error);
                    alert("An error occurred while fulfilling the request.");
                }
            };
    return(
        <div className="content">
            
            <div className="inventory-form-container">
                <div><h2>Stalls Inventory</h2></div>
                <div>
                    <input
                    value={stalls}
                    onChange={(e) => setStalls(e.target.value)}
                    placeholder='Enter stalls...'
                    />
                    <button className="input-button" onClick={handleClick}>Search</button>
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