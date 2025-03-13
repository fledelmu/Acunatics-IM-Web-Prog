import '../../App.css'
import './manage.css'
import {useState, useEffect} from 'react'
import Select from 'react-select'
import { fetchSuppliers, addSuppliers, searchSuppliers } from '../../utils/api'

export default function Suppliers(){
    const actions = [
        {value: "Add", label: "Add"},
        {value: "Search", label: "Search"}
    ]

    const [selectedAction, setSelectedAction] = useState(actions[1])

    const [name, setName] = useState("")
    const [contact, setContact] = useState("")
    const [address, setAddress] = useState("")

    const [records, setRecords] = useState([])
    const [columns, setColumns] = useState([])
    
    const [isEditing, setIsEditing] = useState(false)
    const [editData, setEditData] = useState(null)

    useEffect(() => {
        async function loadSuppliers() {
            let table = []
            table = await fetchSuppliers()
            if (table.length > 0) { 
                setRecords(table)
                setColumns(Object.keys(table[0]))
            } else {
                setRecords([])
                setColumns([])
            }
        }
        loadSuppliers()
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

    const handleClick = async () =>{
        const data = {name, contact, address}
        try {
            if (selectedAction?.value === "Add"){
                const response = await addSuppliers(data)

                if(response.succes === false) {
                    alert(response.message)
                    return
                }

                setContact('')
                setName('')

            const updatedTable = await fetchSuppliers()
                if (updatedTable.length > 0) {
                    setRecords(updatedTable)
                    setColumns(Object.keys(updatedTable[0]))
                } else {
                    setRecords([])
                    setColumns([])
                }
            }

            if (selectedAction?.value === "Search") {
                const result = await searchSuppliers(data)

                setName('')

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
            alert("An error occurred while trying to fulfill the request.")
        }
    }
    

    return(
        <div className='content'>
            <div><h2>Suppliers</h2></div>
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
                    <label>Name:</label>
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter name..."
                    />
                </>
                
                {selectedAction?.value === "Add" && (
                    <>
                        <label>Contact:</label>
                        <input
                            value={contact} 
                            onChange={(e) => setContact(e.target.value)} 
                            placeholder="Enter contact..."
                        />
                
                        <label>Address:</label>
                        <input
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Enter address..."
                        />
                    </>
                )}
                <button className="input-button" onClick={handleClick}>Proceed</button>
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