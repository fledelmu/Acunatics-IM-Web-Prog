import '../../App.css'
import './manage.css'
import { useState, useEffect } from 'react'
import Select from 'react-select'
import { getClients, searchClient, addClient, editClient } from '../../utils/api'

export default function Clients() {
    const actions = [
        { value: "Add", label: "Add" },
        { value: "Search", label: "Search" }
    ]

    const [selectedAction, setSelectedAction] = useState(actions[1])
    const [records, setRecords] = useState([])
    const [columns, setColumns] = useState([])
    const [name, setName] = useState("")
    const [contact, setContact] = useState("")
    const [isEditing, setIsEditing] = useState(false)
    const [editData, setEditData] = useState({})

    useEffect(() => {
        async function loadClients() {
            let table = await getClients()
            if (table.length > 0) {
                setRecords(table)
                setColumns(Object.keys(table[0]))
            } else {
                setRecords([])
                setColumns([])
            }
        }
        loadClients()
    }, [])

    const handleEdit = (record) => {
        setEditData({
            client_id: record.client_id,
            name: record.name,
            contact: record.contact
        })
        setIsEditing(true)
    }

    const handleSave = async () => {
        try {
            await editClient(editData)
            const updatedClients = await getClients()
            if (updatedClients.length > 0) {
                setRecords(updatedClients)
                setColumns(Object.keys(updatedClients[0]))
            } else {
                setRecords([])
                setColumns([])
            }
            setIsEditing(false)
        } catch (error) {
            console.error("Error updating record:", error)
            alert("An error occurred while updating the record.")
        }
    }

    const handleButton = async () => {
        const data = { name, contact }
        try {
            if (selectedAction?.value === "Add") {
                const addResponse = await addClient(data)
                if (!addResponse.success) {
                    alert(addResponse.message)
                    return
                }
                setName('')
                setContact('')
                const updatedClients = await getClients()
                if (updatedClients.length > 0) {
                    setRecords(updatedClients)
                    setColumns(Object.keys(updatedClients[0]))
                } else {
                    setRecords([])
                    setColumns([])
                }
            }
            if (selectedAction?.value === "Search") {
                const result = await searchClient(data)
                setName('')
                setContact('')
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

    return (
        <div className='content'>
            <div><h2>Clients</h2></div>
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
                        placeholder="Enter client name..."
                    />

                    {selectedAction?.value === "Add" && (
                        <>
                            <label>Contact:</label>
                            <input
                                value={contact}
                                onChange={(e) => setContact(e.target.value)}
                                placeholder="Enter contact..."
                            />
                        </>
                    )}
                </>

                <button className="input-button" onClick={handleButton}>Proceed</button>
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
                        {records.map((record, rowIndex) => (
                            <div className='table-row' key={rowIndex}>
                                {columns.map((col, colIndex) => (
                                    <div key={colIndex}>{record[col] || "???"}</div>
                                ))}
                                <button className='table-button' onClick={() => handleEdit(record)}>Edit</button>
                            </div>
                        ))}
                    </>
                )}
            </div>

            {isEditing && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Edit Client</h3>
                        {columns.map((col, index) => (
                            <div key={index}>
                                <label>{col}</label>
                                {col === 'client_id' ? (
                                    <div>{editData[col] || "N/A"}</div>
                                ) : (
                                    <input
                                        value={editData[col] || ""}
                                        onChange={(e) => setEditData({ ...editData, [col]: e.target.value })}
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
