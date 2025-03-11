    import '../../App.css'
    import './process.css'
    import {useState} from 'react'
    import CreatableSelect from 'react-select/creatable'

    export default function Delivery(){
        const options = [
            { value: "Material", label: "Material" }
        ]

        const typeOptions = [
            { value: "Outlet", label: "Outlet" },
            { value: "Client", label: "Client" }
        ]

        const [selected, setSelected] = useState(null)
        
        const [selectedType, setSelectedType] = useState(null)
        
        const [records, setRecords] = useState([])
        const [columns, setColumns] = useState([])
        
        const addDelivery = async () => {
            console.log('clicked')
            
            const type = selectedType.value

            const data = {
                type,
                target: target,
                location: location,
                date: date,
                order_items: order_items
            }
        }
        return (
            <div className="content">
                <div><h2>Delivery Report</h2></div>
                <div className="form">
                    <div><h3>Add Process:</h3></div>
                        
                            <CreatableSelect
                            className="selection"
                            options={typeOptions}
                            value={selectedType}
                            onChange={setSelectedType}
                            isClearable
                            placeholder="Type..."
                            />

                        <button className="input-button">Refresh</button>  

                            <CreatableSelect
                            className="selection"
                            options={options}
                            value={selected}
                            onChange={setSelected}
                            isClearable
                            placeholder={selectedType?.value === "Outlet" ? "Location" : "Client"}
                            />
                        
                            <CreatableSelect
                            className="selection"
                            options={options}
                            value={selected}
                            onChange={setSelected}
                            isClearable
                            placeholder="Product..."
                            />
                        
                        
                        <input placeholder="Enter quantity..."></input> 
                        
                        
                        <input placeholder="Enter price..."></input>
                        
                    <button className="input-button">Add</button>
                </div>
                
                <div className="tableContent">
                    <table className="process-table">
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