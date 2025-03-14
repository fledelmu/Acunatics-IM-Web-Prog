import '../../App.css'
import './manage.css'
import { useState, useEffect } from 'react'
import Select from 'react-select'
import { addProduct, getProducts, searchProducts, editProduct } from '../../utils/api'

export default function Products() {
    const actions = [
        { value: "Add", label: "Add" },
        { value: "Search", label: "Search" }
    ]

    const sizes = [
        { value: "S", label: "S" },
        { value: "M", label: "M" },
        { value: "L", label: "L" }
    ]

    const [selectedAction, setSelectedAction] = useState(actions[1])
    const [records, setRecords] = useState([])
    const [columns, setColumns] = useState([])
    const [name, setName] = useState("")
    const [size, setSize] = useState(sizes[0])
    const [price, setPrice] = useState("")
    const [isEditing, setIsEditing] = useState(false)
    const [editData, setEditData] = useState({})

    useEffect(() => {
        async function loadProducts() {
            let table = await getProducts()
            setRecords(table.length > 0 ? table : [])
            setColumns(table.length > 0 ? Object.keys(table[0]) : [])
        }
        loadProducts()
    }, [])

    const handleEdit = (record) => {
        setEditData({   
            product_id: record.product_id,
            product_name: record.product_name,
            size: record.size,
            price: record.price,
        })
        setIsEditing(true)
    }

    const handleSave = async () => {
        try {
            await editProduct(editData)
            const updatedProducts = await getProducts()
            setRecords(updatedProducts.length > 0 ? updatedProducts : [])
            setColumns(updatedProducts.length > 0 ? Object.keys(updatedProducts[0]) : [])
            setIsEditing(false)
        } catch (error) {
            console.error("Error updating record:", error)
            alert("An error occurred while updating the record.")
        }
    }

    const handleButton = async () => {
        const data = { name, price, size: size.value }
        try {
            if (selectedAction?.value === "Add") {
                const addResponse = await addProduct(data)
                if (!addResponse.success) {
                    alert(addResponse.message)
                    return
                }
                setName('')
                setPrice('')
                setSize(sizes[0])
                const updatedProducts = await getProducts()
                setRecords(updatedProducts.length > 0 ? updatedProducts : [])
                setColumns(updatedProducts.length > 0 ? Object.keys(updatedProducts[0]) : [])
            }
            if (selectedAction?.value === "Search") {
                const result = await searchProducts(data)
                setName('')
                setRecords(result.length > 0 ? result : [])
                setColumns(result.length > 0 ? Object.keys(result[0]) : [])
            }
        } catch (error) {
            console.error("Error executing action:", error)
            alert("An error occurred while fulfilling the request.")
        }
    }

    return (
        <div className='content'>
            <div><h2>Products</h2></div>
            <div className="manage-form-container">
                <Select
                    className="selection"
                    options={actions}
                    value={selectedAction}
                    onChange={setSelectedAction}
                    isClearable
                    placeholder="Select action..."
                />
                <label>Product Name:</label>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter product..." />
                {selectedAction?.value === "Add" && (
                    <>
                        <label>Size:</label>
                        <Select
                            className="selection"
                            options={sizes}
                            value={size}
                            onChange={setSize}
                            isClearable
                            placeholder="Select size..."
                        />
                        <label>Price:</label>
                        <input value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Enter price..." />
                    </>
                )}
                <button className="input-button" onClick={handleButton}>Proceed</button>
            </div>
            <div className="table-container">
                {columns.length === 0 ? (
                    <div>No records found</div>
                ) : (
                    <>
                        <div className='table-header'>
                            {columns.map((col, index) => <div className="table-data" key={index}>{col}</div>)}
                        </div>
                        {records.map((record, rowIndex) => (
                            <div className='table-row' key={rowIndex}>
                                {columns.map((col, colIndex) => <div key={colIndex}>{record[col] || "???"}</div>)}
                                <button className='table-button' onClick={() => handleEdit(record)}>Edit</button>
                            </div>
                        ))}
                    </>
                )}
            </div>
            {isEditing && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Edit Product</h3>
                        <label>ID:</label>
                        <input value={editData.product_id} readOnly />

                        <label>Name:</label>
                        <input 
                            value={editData.product_name} 
                            onChange={(e) => setEditData({ ...editData, product_name: e.target.value })} 
                        />

                        <label>Size:</label>
                        <input 
                            value={editData.size || ""} 
                            onChange={(e) => setEditData({ ...editData, size: e.target.value })} 
                        />

                        <label>Price:</label>
                        <input 
                            value={editData.price || ""} 
                            onChange={(e) => setEditData({ ...editData, price: e.target.value })} 
                        />

                        <button onClick={handleSave} className="input-button">Save</button>
                        <button onClick={() => setIsEditing(false)} className="input-button">Cancel</button>
                    </div>
                </div>
            )}

        </div>
    )
}
