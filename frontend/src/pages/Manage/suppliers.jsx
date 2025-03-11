import '../../App.css'
import './manage.css'
import {useState} from 'react'
import CreatableSelect from 'react-select/creatable'
import Select from 'react-select'

export default function SupplierS(){
    const actions = [
        {value: "Add", label: "Add"},
        {value: "Search", label: "Search"}
    ]
    const options = [
        {value: "Manager 131231dsa", label: "Manager 1123123213"}
    ]

    const [selected, setSelected] = useState(null)

    const [selectedAction, setSelectedAction] = useState("Search")

    const [name, setName] = useState("")
    const [contact, setContact] = useState("")
    const [address, setAddress] = useState("")

    const [records, setRecords] = useState([])
    const [columns, setColumns] = useState([])

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
                <button className="input-button">Proceed</button>
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