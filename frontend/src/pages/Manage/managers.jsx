import '../../App.css'
import './manage.css'
import {useState} from 'react'
import CreatableSelect from 'react-select/creatable'
import Select from 'react-select'
import {addManager, findManager, fetchManagers} from '../../utils/api'

export default function Managers(){
    const actions = [
        {value: "Add", label: "Add"},
        {value: "Search", label: "Search"}
    ]

    const options = [
        {value: "Manager 1", label: "Manager 1"}
    ]

    const [selectedAction, setSelectedAction] = useState(actions[1])

    const [name, setName] = useState("")

    const [contact, setContact] = useState("")

    const [inputValue, setInputValue] = useState("");

    const [records, setRecords] = useState([])
    const [columns, setColumns] = useState([])

    const handleButton = async () => {
        const data = {
            name: name,
            contact: contact
        }

        try{   

            let table = []
            table = await fetchManagers()

            if(selectedAction?.value === "Add"){
                const result = await addManager(data)
                setContact('')
                setName('')
                if (table.length > 0) setColumns(Object.keys(result[0]))
                setRecords(table)
            }
            
            if(selectedAction?.value === "Search"){
                const result = await findManager(data)

                setName('')
                setRecords(result)
                if (result.length > 0) setColumns(Object.keys(result[0]))
            }

        } catch (error){
            console.error("Error exucting action:", error)
            alert("An error occurred while fulfilling request.")
        }
        
    }

    return(
        <div className='content'>
            <div><h2>Managers</h2></div>
            <div className="manage-form-container">
                <Select
                className="selection"
                options={actions}
                value={selectedAction}
                onChange={(value) => setSelectedAction(value)}
                isClearable
                placeholder="Select action..."
                />
                <label>Name:</label>
                        <input
                            type="text" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            placeholder="Enter name..."
                        />
                {selectedAction?.value === "Add" && (
                    <>
                        <label>Contact:</label>
                        <input
                            type="number" 
                            value={contact} 
                            onChange={(e) => setContact(e.target.value)} 
                            placeholder="Enter contact..."
                        />
                    </>
                )}
                <button className="input-button" onClick={handleButton}>Proceed</button>
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