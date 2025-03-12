import '../../App.css'
import './manage.css'
import { useState, useEffect } from 'react'
import Select from 'react-select'
import { addEmployee, fetchEmployees, searchEmployee } from '../../utils/api'

export default function Employees() {
    const actions = [
        { value: "Add", label: "Add" },
        { value: "Search", label: "Search" }
    ]

    const [selectedAction, setSelectedAction] = useState(actions[1])
    const [name, setName] = useState("")
    const [contact, setContact] = useState("")
    const [records, setRecords] = useState([])
    const [columns, setColumns] = useState([])

    useEffect(() => {
        async function loadEmployees() {
            let table = await fetchEmployees()
            if (table.length > 0) {
                setRecords(table)
                setColumns(Object.keys(table[0]))
            } else {
                setRecords([])
                setColumns([])
            }
        }
        loadEmployees()
    }, [])

    const handleButton = async () => {
        const data = { name, contact };
    
        if (!selectedAction) {
            alert("Please select an action.");
            return;
        }
    
        try {
            if (selectedAction?.value === "Add") {
                console.log("Adding employee...", data);
                const addResponse = await addEmployee(data);
                console.log("Add Response:", addResponse);
    
                if (!addResponse || addResponse.success === false) {
                    alert(addResponse?.message || "Failed to add employee.");
                    return;
                }
    
                setContact('');
                setName('');
    
                console.log("Fetching updated employees...");
                const updatedEmployees = await fetchEmployees();
                console.log("Updated Employees:", updatedEmployees);
    
                if (updatedEmployees?.length > 0) {
                    setRecords(updatedEmployees);
                    setColumns(Object.keys(updatedEmployees[0]));
                } else {
                    setRecords([]);
                    setColumns([]);
                }
            }
    
            if (selectedAction?.value === "Search") {
                console.log("Searching manager...", data);
                const result = await searchEmployee(data);
                console.log("Search Results:", result);
    
                setName('');
    
                if (result?.length > 0) {
                    setRecords(result);
                    setColumns(Object.keys(result[0]));
                } else {
                    setRecords([]);
                    setColumns([]);
                }
            }
        } catch (error) {
            console.error("Error executing action:", error);
            alert("An error occurred while fulfilling the request.");
        }
    };
    

    return (
        <div className='content'>
            <div><h2>Employees</h2></div>
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
                        placeholder="Enter name"
                    />
                </>
                {selectedAction?.value === "Add" && (
                    <>
                        <label>Contact:</label>
                        <input
                            value={contact}
                            onChange={(e) => setContact(e.target.value)}
                            placeholder="Enter contact"
                        />
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
