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
 
    const [records, setRecords] = useState([])
    const [columns, setColumns] = useState([])
    
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
                        placeholder="Enter name..."
                        />
                    </>
                )}
                <button className="input-button" onClick={handleClick}>Proceed</button>
            </div>
            
            <div className="manage-table-content">
                <table className="manage-table">
                    <thead>
                        <tr>
                            {columns.map((column, index) => (
                                <th key={index}>{column.replace(/_/g, ' ')}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {records.length > 0 ? (
                            records.map((record, index) => (
                                <tr key={index}>
                                    {columns.map((column, colIndex) => (
                                        <td key={colIndex}>{record[column]}</td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns.length || 1}>No records found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}