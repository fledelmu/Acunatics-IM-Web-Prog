    import '../../App.css'
    import './process.css'
    import {useState} from 'react'
    import Select from 'react-select'
    import { processDelivery, fetchRecords} from '../../utils/api'
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

        const [isEditing, setIsEditing] = useState(false)
        const [editData, setEditData] = useState(null)
        
        const [name, setName] = useState('')
        const [product, setProduct] = useState('')
        const [outlet, setOutlet] = useState('')
        const [location, setLocation] = useState('')
        const [quantity, setQuantity] = useState('')
        const [price, setPrice] = useState('')
        const [selectedDate, setSelectedDate] = useState('')

        const [isEditing, setIsEditing] = useState(false)
        const [editData, setEditData] = useState(null)

        const addDelivery = async () => {
            console.log('clicked');
        
            if (!selectedType || !selected || !target || !location|| !product) {
                alert("Please fill in all fields");
                return;
            }
        
            const data = {
                type: type,
                target: target,
                location: location,
                product: product,
                date: date,
                quantity: quantity,
                price: price
            };
        
            try {
                await processDelivery(data);

                if(selectedType?.value === "Outlet"){
                    let table = await fetchRecords('delivery-records');
                    setColumns(Object.keys(table[0]));
                    setRecords(table);

                    setName('');
                    setLocation('');
                }
                

            } catch (error) {
                console.error("Error in addDelivery:", error);
                alert("An error occurred while processing delivery.");
            }
        };
        
        return (
            <div className="content">
                <div><h2>Delivery Report</h2></div>
                <div className="form">
                    <div><h3>Add Process:</h3></div>
                        
                            <Select
                            className="selection"
                            options={typeOptions}
                            value={selectedType}
                            onChange={setSelectedType}
                            isClearable
                            placeholder="Type..."
                            />

                        <button className="input-button">Refresh</button>  
                        

                        <input

                        onChange = {(e) => setName(e.target.value)}
                        value={name}
                        placeholder={selectedType?.value === "Outlet" ? "Outlet" : "Client"}
                        />
                        
                        {selectedType?.value === "Client" && (
                            <input
                            onChange = {(e) => setLocation(e.target.value)}
                            value={location}
                            placeholder="Enter location..."
                            />
                        )}
                        <input
                        onChange = {(e) => setProduct(e.target.value)}
                        value={product}
                        placeholder="Enter product..."
                        />                 
                        
                        <input 
                        onChange = {(e) => setQuantity(e.target.value)}
                        placeholder="Enter quantity..."></input> 
                        
                        
                        <input 
                        onChange = {(e) => setPrice(e.target.value)}
                        placeholder="Enter price..."></input>

                    <button className="input-button" onClick={addDelivery}>Add</button>
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
                {isEditing && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Edit Outlet</h3>
                        {columns.map((col, index) => (
                            <div key={index}>   
                                <label>{col}</label>
                                {col === columns[0] ? (
                                    <div>{editData[col]}</div> 
                                ) : (
                                    <input 
                                        value={editData[col] || ""} 
                                        onChange={(e) => setEditData({ ...editData, [col]: e.target.value })}
                                        disabled={col === columns[0]}
                                    />
                                )}
                            </div>
                        ))}
                        <button onClick={handleSave} className="input-button">Save</button>
                        <button onClick={() => setIsEditing(false)} className="input-button">Cancel</button>
                    </div>
                </div>
            )}
            </div>
        )
    }