import '../../App.css'
import './manage.css'
import { useState, useEffect } from 'react'
import Select from 'react-select'
import { addProduct, getProducts, searchProducts } from '../../utils/api'

export default function Products(){
    const actions = [
        {value: "Add", label: "Add"},
        {value: "Search", label: "Search"}
    ]

    const sizes = [
        {value: "S", label: "S"},
        {value: "M", label: "M"},
        {value: "L", label: "L"}
    ]

    const [name, setName] = useState("")
    const [size, setSize] = useState(sizes[0])
    const [price, setPrice] = useState("")

    const [selectedAction, setSelectedAction] = useState(actions[1])

    const [records, setRecords] = useState([])
    const [columns, setColumns] = useState([])
    
   useEffect(() => {
           async function loadProducts() {
               let table = []
               table = await getProducts()
               if (table.length > 0) { 
                   setRecords(table)
                   setColumns(Object.keys(table[0]))
               } else {
                   setRecords([])
                   setColumns([])
               }
           }
           loadProducts()
       }, [])
       
    const handleButton = async () => {
        const data = { name, price, size }
        console.log("clicked")
        try {
            if (selectedAction?.value === "Add") {
                const addResponse = await addProduct(data)

                setName('')
                setPrice('')
                setSize('')
                
                const updatedProducts = await getProducts()

                setRecords(updatedProducts)
                setColumns(Object.keys(updatedProducts[0]))
            }

            if (selectedAction?.value === "Search") {
                console.log("Searching Product...", data)
                const result = await searchProducts(data)
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
            <div><h2>Products</h2></div>
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
                    <label>Product Name:</label>
                    <input
                    value = {name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter product..."
                    />
                </>
                {selectedAction?.value === "Add" && (
                    <>
                        <label>Size:</label>
                        <Select
                        className="selection"
                        options={sizes}
                        value={sizes.find(s => s.value === size)}
                        onChange={(selectedOption) => setSize(selectedOption ? selectedOption.value : "")}
                        isClearable
                        placeholder="Select size..."
                        />
                    
                        <label>Price:</label>
                        <input
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="Enter price..."
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