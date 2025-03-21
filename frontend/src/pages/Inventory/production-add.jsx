import '../../App.css'
import './inventory.css'
import { useState, useEffect } from "react"
import  Select  from 'react-select'
import { addInventory, viewInventory } from '../../utils/api'

export default function InvProduction(){

    const sizes = [
        {value: "S", label: "S"},
        {value: "M", label: "M"},
        {value: "L", label: "L"}
    ]

    const [product, setProduct] = useState("")
    const [size, setSize] = useState(sizes[0])
    const [quantity, setQuantity] = useState("")
    const [batch, setBatch] = useState("")

    const [records, setRecords] = useState([])
    const [columns, setColumns] = useState([])

    useEffect(() => {
            async function loadInventory() {
                let table = []
                table = await viewInventory()
                if (table.length > 0) { 
                    setRecords(table)
                    setColumns(Object.keys(table[0]))
                } else {
                    setRecords([])
                    setColumns([])
                }
            }
            loadInventory()
        }, [])
        
        const handleClick = async () => {
            console.log("clicked");
        
            if (!product || !size || !quantity) {
                console.error("Missing required fields");
                return;
            }
        
            const data = {
                product_name: product,   
                size: size?.value || "",  
                quantity: Number(quantity),
                batch: batch
            };
        
            console.log("Data being sent:", data); // Debugging
        
            try {
                const response = await addInventory(data);
                console.log("Response from API:", response); // Debugging
        
                setProduct("");
                setQuantity("");
        
                const table = await viewInventory();
                console.log("Table data after insert:", table);
                if (table.length > 0) {
                    setRecords(table);
                    setColumns(Object.keys(table[0]));  
                } else {
                    setRecords([]);
                    setColumns([]);
                }
            } catch (error) {
                console.error("Error executing action:", error);
                alert("An error occurred while fulfilling the request.");
            }
        };
        

    return(
        <>
            <div className="content">
                
                <div className="inventory-form-container">
                    <div><h2>Production Inventory</h2></div>
                    <div className="inventory-form">
                        <div><h3>New Entry</h3></div>

                        <div>
                            <label><h3>Product:</h3></label>
                        </div>
                        <div>
                            <input
                            className="selection"
                            value={product}
                            onChange={(e) => setProduct(e.target.value)}
                            placeholder= "Enter product..."
                            />
                        </div>
                        <div>
                            <label><h3>Quantity:</h3></label>
                        </div>
                        <div>
                            <input 
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            placeholder='Enter quantity...'/>
                        </div>
                        <div>
                            <label><h3>Batch:</h3></label>
                        </div>
                        <div>
                            <input 
                            value={batch}
                            onChange={(e) => setBatch(e.target.value)}
                            placeholder='Enter batch...'/>
                        </div>
                        <Select
                        className="selection"
                        options={sizes}
                        value={size} // size should be an object
                        onChange={(selectedOption) => setSize(selectedOption)}
                        placeholder="Select size..."
                        />
                        <button className="input-button" onClick={handleClick}>Add</button>
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
                                    <div><h1>No records found</h1></div>
                                ) : (
                                    records.map((record, rowIndex) => (
                                        <div className="table-row" key={rowIndex}>
                                            {columns.map((col, colIndex) => (
                                                <div key={colIndex}>{record[col] || "N/A"}</div>
                                            ))}
                                        </div>
                                    ))
                                )}
                                
                            </>
                        )}
                    </div>
                </div>
                
            </div>
        </>
        
    )
}