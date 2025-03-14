import '../../App.css'
import { useState, useEffect } from "react"
import Select from 'react-select/creatable'
import { processSupply, fetchRecords } from '../../utils/api'

export default function Supply() {
    const units = [
        { value: "kg", label: "kg" },
        { value: "pcs", label: "pcs" },
        { value: "g", label: "g" }
    ]

    const [selectedUnit, setSelectedUnit] = useState(units[0])
    const [supplier, setSupplier] = useState('')
    const [quantity, setQuantity] = useState('')
    const [item_name, setProduct] = useState('')
    const [price, setPrice] = useState('')

    const [records, setRecords] = useState([])
    const [columns, setColumns] = useState([])


    useEffect(() => {
        async function loadSupply() {
            try {
                let table = await fetchRecords('supply-records')
                if (table.length > 0) {
                    setColumns(Object.keys(table[0]))
                    setRecords(table)
                }
            } catch (error) {
                console.error("Error loading records:", error)
            }
        }
        loadSupply();
    }, []);



    const addSupply = async () => {
        console.log('clicked')

        if (!supplier || !item_name || !quantity || !price || !selectedUnit) {
            alert("Please fill in all fields")
            return
        }

        const data = {
            supplier,
            item_name,
            quantity,
            price,
            unit: selectedUnit.value
        }

        try {
            await processSupply(data)
            let table = await fetchRecords('supply-records')

            setSupplier('')
            setProduct('')
            setQuantity('')
            setPrice('')
            setSelectedUnit(units[0])

            if (table.length > 0) {
                setColumns(Object.keys(table[0]))
                setRecords(table)
            }
        } catch (error) {
            console.error("Error in addSupply:", error)
            alert("An error occurred while processing supply.")
        }
    }

    return (
        <div className="content">
            <div><h2>Supply Report</h2></div>
            <div className="form">
                <div><h3>Add Process:</h3></div>
                <div className="formInput">
                    <input
                        value={supplier}
                        onChange={(e) => setSupplier(e.target.value)}
                        placeholder="Enter supplier..."
                    />
                </div>
                <div className="formInput">
                    <input
                        value={item_name}
                        onChange={(e) => setProduct(e.target.value)}
                        placeholder="Enter product..."
                    />
                </div>
                <div className="formInput">
                    <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        placeholder="Quantity"
                    />
                </div>
                <div className="formInput">
                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="Price"
                    />
                </div>
                <div className="formInput">
                    <Select
                        className="selection"
                        options={units}
                        value={selectedUnit}
                        onChange={setSelectedUnit}
                        isClearable
                        placeholder="Unit"
                    />
                </div>
                <button className="input-button" onClick={addSupply}>Add</button>
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
                        {records.length === 0 ? (
                            <div></div>
                        ) : (
                            records.map((record, rowIndex) => (
                                <div className='table-row' key={rowIndex}>
                                    {columns.map((col, colIndex) => (
                                        <div key={colIndex}>{record[col] || "???"}</div>
                                    ))}
                                </div>
                            ))
                        )}
                    </>
                )}
            </div>
        </div>
    )
}
