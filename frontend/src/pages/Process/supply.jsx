import '../../App.css'
import {useState} from "react"
import CreatableSelect from 'react-select/creatable'

export default function Supply(){
    const options = [
        { value: "Person 1", label: "Person 1" }
    ]

    const units = [
        { value: "kg", label: "kg" },
        { value: "pcs", label: "pcs" },
        { value: "g", label: "g" }
    ]

    const [selected, setSelected] = useState(null)

    const [selectedUnit, setSelectedUnit] = useState(null)

    const [records, setRecords] = useState([])
    const [columns, setColumns] = useState([])
    
    return(
        <div className="content">
            <div><h2>Supply Report</h2></div>
            <div className="form">
                <div><h3>Add Process:</h3></div>
                <div className="formInput">
                    <CreatableSelect
                    className="selection"
                    options={options}
                    value={selected}
                    onChange={setSelected}
                    isClearable
                    placeholder="Supplier"
                    />
                </div>
                <div className="formInput">
                    <input placeholder="quantity"></input>
                </div>
                <div className="formInput">
                    <input placeholder="price"></input>
                </div>
                <div className="formInput">
                    <CreatableSelect
                    className="selection"
                    options={units}
                    value={selectedUnit}
                    onChange={setSelectedUnit}
                    isClearable
                    placeholder="Unit"
                    />
                </div>
                <button className="input-button">Add</button>
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