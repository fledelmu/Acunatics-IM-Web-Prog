import '../../App.css';
import './process.css';
import { useState, useEffect } from 'react';
import Select from 'react-select';
import { processDelivery, fetchRecords } from '../../utils/api';

export default function Delivery() {
    const typeOptions = [
        { value: "Outlet", label: "Outlet" },
        { value: "Client", label: "Client" }
    ];

    const [selectedType, setSelectedType] = useState(null);
    const [records, setRecords] = useState([]);
    const [columns, setColumns] = useState([]);

    const [target, setTarget] = useState('');
    const [location, setLocation] = useState('');
    const [product, setProduct] = useState('');
    const [quantity, setQuantity] = useState('');
    const [price, setPrice] = useState('');

    useEffect(() => {
        async function loadDelivery() {
            try {
                let table = await fetchRecords('delivery-records')
                if (table.length > 0) {
                    setColumns(Object.keys(table[0]))
                    setRecords(table)
                }
            } catch (error) {
                console.error("Error loading records:", error)
            }
        }
        loadDelivery();
    }, []);

    const addDelivery = async () => {
        if (!selectedType || !target || !product || !quantity || !price) {
            alert("Please fill in all fields");
            return;
        }

        const data = {
            type: selectedType.value,
            target: target,
            location: selectedType.value === "Client" ? location : "", // Only send location for Clients
            product: product,
            quantity: quantity,
            price: price
        };

        try {
            await processDelivery(data);
            let table = await fetchRecords('delivery-records');
            setColumns(table.length > 0 ? Object.keys(table[0]) : []);
            setRecords(table);

            // Reset input fields
            setTarget('');
            setLocation('');
            setProduct('');
            setQuantity('');
            setPrice('');
        } catch (error) {
            console.error("Error in addDelivery:", error);
            alert("An error occurred while processing delivery.");
        }
    };

    return (
        <div className="content">
            <h2>Delivery Report</h2>
            <div className="form">
                <h3>Add Process:</h3>

                <Select
                    className="selection"
                    options={typeOptions}
                    value={selectedType}
                    onChange={setSelectedType}
                    isClearable
                    placeholder="Select Type..."
                />

                <button className="input-button">Refresh</button>

                <input
                    onChange={(e) => setTarget(e.target.value)}
                    value={target}
                    placeholder={selectedType?.value === "Outlet" ? "Outlet" : "Client"}
                />

                {selectedType?.value === "Client" && (
                    <input
                        onChange={(e) => setLocation(e.target.value)}
                        value={location}
                        placeholder="Enter location..."
                    />
                )}

                <input
                    onChange={(e) => setProduct(e.target.value)}
                    value={product}
                    placeholder="Enter product..."
                />

                <input
                    onChange={(e) => setQuantity(e.target.value)}
                    value={quantity}
                    placeholder="Enter quantity..."
                />

                <input
                    onChange={(e) => setPrice(e.target.value)}
                    value={price}
                    placeholder="Enter price..."
                />

                <button className="input-button" onClick={addDelivery}>Add</button>
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
                            <div>No records found</div>
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
    );
}