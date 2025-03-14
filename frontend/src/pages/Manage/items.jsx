import '../../App.css'
import './manage.css'
import {useState, useEffect} from 'react'
import Select from 'react-select'
import { addItem, getItems, searchItem, editItem} from '../../utils/api'


export default function Items(){
    const actions = [
        {value: "Add", label: "Add"},
        {value: "Search", label: "Search"}
    ]
    const units = [
        {value: "g", label: "grams"},
        {value: "kg", label: "kilograms"},
        {value: "L", label: "liters"},
        {value: "pcs", label: "pieces"}
    ]
    const types = [
        {value: "Food", label: "Food"},
        {value: "Liqiud", label: "Liquids"},
        {value: "Packaging", label: "Packaging"},
    ]

    const [selectedAction, setSelectedAction] = useState(actions[1])
    
    const [type, setType] = useState("")
    const [name, setName] = useState("")
    const [unit, setSelectedUnit] = useState(units[0])
    const [price, setPrice] = useState("")

    const [records, setRecords] = useState([])
    const [columns, setColumns] = useState([])
    
    const [isEditing, setIsEditing] = useState(false)
    const [editData, setEditData] = useState(null)

    useEffect(() => {
        async function loadItems() {
            let table = []
            table = await getItems()
            if (table.length > 0) { 
                setRecords(table)
                setColumns(Object.keys(table[0]))
            } else {
                setRecords([])
                setColumns([])
            }
        }
        loadItems()
    }, [])


    const handleEdit = (record) => {
        setEditData({
            item_type_id: record.item_type_id, 
            item_name: record.item_name, 
            item_type: record.item_type,  
            unit: record.unit,  
            price: record.price
        })
        setIsEditing(true)
    }
    
    const handleSave = async () => {
        try {   
            await editItem(editData)  // Ensure this function is correctly updating the data
            const updatedItems = await getItems()
            
            setRecords(updatedItems.length > 0 ? updatedItems : [])
            setColumns(updatedItems.length > 0 ? Object.keys(updatedItems[0]) : [])
            setIsEditing(false)
        } catch (error) {
            console.error("Error updating record:", error)
            alert("An error occurred while updating the record.")
        }
    }
    
    const handleButton = async () => {
        const data = { 
            item_name: name, 
            item_type: type?.value,  
            unit: unit?.value,  
            price: price
        }
    
        try {
            if (!type || !name || !unit || !price) {
                alert("Enter all fields")
                return
            }
    
            if (selectedAction?.value === "Add") {
                const addResponse = await addItem(data)
                if (!addResponse.success) {
                    alert(addResponse.message)
                    return
                }
                setName('')
                setPrice('')
                setType(null) // Reset select
                setSelectedUnit(units[0]) // Reset to default unit
    
                const updatedItems = await getItems()
                setRecords(updatedItems.length > 0 ? updatedItems : [])
                setColumns(updatedItems.length > 0 ? Object.keys(updatedItems[0]) : [])
            }
    
            if (selectedAction?.value === "Search") {
                const result = await searchItem(data)
                setName('')
    
                setRecords(result.length > 0 ? result : [])
                setColumns(result.length > 0 ? Object.keys(result[0]) : [])
            }
        } catch (error) {
            console.error("Error executing action:", error)
            alert("An error occurred while fulfilling the request.")
        }
    }
    
    return(
        <div className='content'>
            <div><h2>Items</h2></div>
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
                <label>Name: </label>
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter name..."
                />
                </>
                
                {selectedAction?.value === "Add" && (
                    <>
                    <label>Type:</label>
                    <Select
                        className="selection"
                        options={types} 
                        value={type} 
                        onChange={setType} 
                        placeholder="Choose type..."
                    />

                    <label>Unit:</label>
                    <Select
                        className="selection"
                        options={units} 
                        value={unit} 
                        onChange={setSelectedUnit} 
                        placeholder="Choose unit..."
                    />
                    
                    <label>Price:</label>
                    <input
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Enter price..."/>
                    </>
                    
                )}
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