import '../../App.css'
import './process.css'
import Select from 'react-select'
import {useState, useEffect} from 'react'
import { processProduction, fetchRecords } from '../../utils/api'

export default function Production(){
    const options = [
        { value: "1", label: "1" },
        { value: "2", label: "2" },
        { value: "3", label: "3" },
        { value: "4", label: "4" },
        { value: "5", label: "5" }
    ]

    const [selected, setSelected] = useState(null)
    const [totalWeight, setTotalWeight] = useState('')
    const [startWeight, setStartWeight] = useState('')
    const [endWeight, setEndWeight] = useState('')

    const [records, setRecords] = useState([])
    const [columns, setColumns] = useState([])

    useEffect(() => {
        async function loadProduction() {
            let table = []
            table = await fetchRecords('production-records')
            setColumns(Object.keys(table[0]))
            setRecords(table)
        }
        loadProduction();
    }, []);

    const addProduction = async () => {
        console.log('clicked')

        if (!selected || !totalWeight || !startWeight || !endWeight) {
            alert("Please fill in all fields");
            return
        }

        const vat = selected.value

        const data = {
            vat,
            total_weight: totalWeight,
            start_weight: startWeight,
            end_weight: endWeight,
        }

        try{
            const response = await processProduction(data)
            let table = []
            table = await fetchRecords('production-records')


            setSelected(null)
            setTotalWeight('')
            setStartWeight('')
            setEndWeight('')
            
            setColumns(Object.keys(table[0]))
            setRecords(table)
        } catch (error) {
            console.error("Error in addProduction:", error)
            alert("An error occurred while processing production.")
        }
    }
    return (
        <div className="content">
            <div><h2>Production Report</h2></div>
            <div className="form">
                <div><h3>Add Process:</h3></div>
               
                <Select
                options={options}
                value={selected}
                onChange={setSelected}
                isClearable
                placeholder="Vat Number"
                />
                
                <input 
                    placeholder='Enter total weight...'
                    value={totalWeight}
                    onChange={(e) => setTotalWeight(e.target.value)}
                /> 

                <input 
                    placeholder='Enter starting weight...'
                    value={startWeight}
                    onChange={(e) => setStartWeight(e.target.value)}
                /> 
                
                <input 
                    placeholder='Enter ending weight...'
                    value={endWeight}
                    onChange={(e) => setEndWeight(e.target.value)}
                /> 
                
                <button className="input-button" onClick={addProduction}>Add</button>

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
        </div>
    )
}