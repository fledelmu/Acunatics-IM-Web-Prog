import '../../App.css'
import './records.css'
import Select from 'react-select'
import {useState} from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import {fetchRecords} from '../../utils/api'
import dayjs from 'dayjs'
import Delivery from '../Process/delivery'


export default function RecordsProduction(){
    const type = [
        { value: "Production", label: "Production" },
        { value: "DeliveryOutlet", label: "Delivery - Outlet" },
        { value: "DeliveryClient", label: "Delivery - Client" },
        { value: "Supply", label: "Supply" }
    ]

    const [selectedType, setSelectedType] = useState(null)

    const [selectedDate, setSelectedDate] = useState(null)
    const [records, setRecords] = useState([])
    const [columns, setColumns] = useState([])

    const fetchInfo = async () => {
        console.log("clicked");

        try {

            
            const formattedDate = selectedDate ? dayjs(selectedDate).format('YYYY-MM-DD') : null;
            console.log("Formatted Date Sent:", formattedDate);
            const data = { date: formattedDate };

            console.log("Formatted Date Sent:", formattedDate);

            const endPoints = {
                Production: 'production-records',
                DeliveryClient: 'client-delivery-records',
                DeliveryOutlet: 'outlet-delivery-records',
                Supply: 'supply-records',
            };

            if (!selectedType) {
                console.error("No type selected");
                return;
            }

            console.log("Fetching records for:", selectedType.value);

            const response = await fetchRecords(endPoints[selectedType.value], data);
            console.log("Fetched Data:", data);

            if (!response || response.length === 0) {
                setColumns([]);
                setRecords([]);
                console.warn("No records found");
                return;
            }

            console.log("Setting columns:", Object.keys(response[0]));
            setColumns(Object.keys(response[0]));
            setRecords(response);
        } catch (error) {
            console.error("Fetching error:", error);
            setColumns([]);
            setRecords([]);
        }
    };

    return(
        <div className="content">
            <div className="records-content">
                <div className="records-combobox-container">
                    <div className="records-combobox">
                        <Select
                        options={type}
                        value={selectedType}
                        onChange={setSelectedType}
                        isClearable
                        placeholder="Type"
                        />
                    </div>
                    <div>
                        <DatePicker 
                            className="datePicker"
                            selected={selectedDate} 
                            onChange={(date) => setSelectedDate(date)} 
                            dateFormat="yyyy-MM-dd" 
                            isClearable
                            placeholderText="Select a date"
                        />
                    </div>
                    <div>
                        <button className="input-button" onClick={fetchInfo}>Proceed</button>
                    </div>
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
    )
}