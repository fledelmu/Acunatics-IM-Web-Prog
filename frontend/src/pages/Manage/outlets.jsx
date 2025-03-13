import '../../App.css'
import './manage.css'
import { useState, useEffect } from 'react'
import Select from 'react-select'
import { fetchOutlets, searchOutlet, addOutlet } from '../../utils/api'
export default function Outlets(){
    const actions = [
        {value: "Add", label: "Add"},
        {value: "Search", label: "Search"}
    ]

    const [selectedAction, setSelectedAction] = useState("Search")

    const [records, setRecords] = useState([])
    const [columns, setColumns] = useState([])

    const [location, setLocation] = useState("")

    const [isEditing, setIsEditing] = useState(false)
    const [editData, setEditData] = useState(null)

    useEffect(() => {
        async function loadOutlets() {
            let table = []
            table = await fetchOutlets()
            if (table.length > 0) { 
                setRecords(table)
                setColumns(Object.keys(table[0]))
            } else {
                setRecords([])
                setColumns([])
            }
        }
        loadOutlets()
    }, [])

    const handleEdit = (record) => {
        setEditData(record) 
        setIsEditing(true) 
    }
    
    const handleSave = async () => {
        try {
            //const updatedRecord = await updateOutlet(editData) 
            setRecords(records.map(r => r.id === updatedRecord.id ? updatedRecord : r)) 
            setIsEditing(false) 
        } catch (error) {
            console.error("Error updating record:", error)
            alert("Failed to update record")
        }
    }

    const handleButton = async () => {
        const data = { location }
        console.log("clicked")
        try {
            if (selectedAction?.value === "Add") {
                const addResponse = await addOutlet(data)

                if (addResponse.success === false) {
                    alert(addResponse.message)
                    return
                }
                setLocation('')

                const updatedOutlets = await fetchOutlets()
                if (updatedOutlets.length > 0) {
                    setRecords(updatedOutlets)
                    setColumns(Object.keys(updatedOutlets[0]))
                } else {
                    setRecords([])
                    setColumns([])
                }
            }

            if (selectedAction?.value === "Search") {
                console.log("Searching Outlet...", data)
                const result = await searchOutlet(data)
                console.log("Search Results:", result)

                setLocation('')
                if (result.length > 0) {
                    setRecords(result)
                    setColumns(Object.keys(result[0]))
                } else {
                    setRecords([])
                    setColumns([])
                }
            }
        } catch (error) {
            console.error("Error executing action:", error)
            alert("An error occurred while fulfilling the request.")
        }
    }

    return(
        <div className='content'>
            <div><h2>Outlets</h2></div>
            <div className="manage-form-container">
                <Select
                className="selection"
                options={actions}
                value={selectedAction}
                onChange={(value) => setSelectedAction(value)}
                isClearable
                placeholder="Select action..."
                />
                <> 
                    <label>Location:</label>
                    <input 
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Enter location..."
                    />
                </>
                
                <button className="input-button" onClick={handleButton}>Proceed</button>
            </div>
            
            <div className="table-container">
                {columns.length === 0 ? (
                    <div> No records found</div>
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
                                <button className='table-button' onClick={() => handleEdit(record)}>Edit</button>
                            </div>
                        ))
                    )}
                    </>
                )}
            </div>
            {isEditing && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Edit Outlet</h3>
                        {columns.map((col, index) => (
                            <div key={index}>   
                                <label>{col}</label>
                                {col === columns[0] ? (
                                    <div>{editData[col]}</div> 
                                ) : (
                                    <input 
                                        value={editData[col] || ""} 
                                        onChange={(e) => setEditData({ ...editData, [col]: e.target.value })}
                                        disabled={col === columns[0]}
                                    />
                                )}
                            </div>
                        ))}
                        <button onClick={handleSave} className="input-button">Save</button>
                        <button onClick={() => setIsEditing(false)} className="input-button">Cancel</button>
                    </div>
                </div>
            )}
        </div>
      
    )
}