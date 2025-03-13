import '../../App.css'
import './manage.css'
import {useState, useEffect} from 'react'
import Select from 'react-select'
import { addItem, getItems, searchItem} from '../../utils/api'


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

    const [selectedAction, setSelectedAction] = useState("Search")
    
    const [type, setType] = useState("")
    const [name, setName] = useState("")
    const [unit, setSelectedUnit] = useState(units[0])
    const [price, setPrice] = useState("")

    const [records, setRecords] = useState([])
    const [columns, setColumns] = useState([])

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


    const handleButton = async () => {
        const data = { 
            name: name, 
            type: type?.value || null,  
            unit: unit?.value || null,  
            price: price
        }

         console.log("clicked")
        try {
            if (selectedAction?.value === "Add") {
                const addResponse = await addItem(data)
    
                setName('')
                setPrice('')

                    
                const updatedItems = await getItems()
    
                setRecords(updatedItems)
                setColumns(Object.keys(updatedItems[0]))
            }
    
            if (selectedAction?.value === "Search") {
                console.log("Searching Item...", data)
                const result = await searchItem(data)
                console.log("Search Results:", result)
    
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
                                <button className='table-button'>Edit</button>
                            </div>
                        ))
                    )}
                    </>
                )}
            </div>
        </div>
      
    )
}