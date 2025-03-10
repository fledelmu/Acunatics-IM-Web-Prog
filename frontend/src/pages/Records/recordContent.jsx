import '../../App.css'
import './records.css'
import Select from 'react-select'
import {useState} from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import {getProduction} from '../../utils/api'


export default function RecordsProduction(){
    const sampleType = [
        { value: "Production", label: "Production" },
        { value: "Delivery", label: "Delivery" },
        { value: "Supply", label: "Supply" }
    ]

    const order = [
        { value: "Ascending", label: "Ascending" },
        { value: "Descending", label: "Descending" },
    ]

    const [selectedType, setSelectedType] = useState(null)
    const [selectedOrder, setSelectedOrder] = useState(null)
    const [selectedDate, setSelectedDate] = useState(null)
    const [records, setRecords] = useState([])
    const [columns, setColumns] = useState([])

    const fetchRecords = async () => {
        const order = selectedOrder ? selectedOrder.value : "ASC"
        const data = await getProduction(order)
        
        
        if (data.length > 0) {
            setColumns(Object.keys(data[0]))
        } else {
            setColumns([])
        }

        setRecords(data);
    };

    return(
        <div className="content">
            <div className="records-content">
                <div className="records-combobox-container">
                    <div className="records-combobox">
                        <Select
                        options={sampleType}
                        value={selectedType}
                        onChange={setSelectedType}
                        isClearable
                        placeholder="Type"
                        />
                    </div>
                    <div className="records-combobox">
                        <Select
                        options={order}
                        value={selectedOrder}
                        onChange={setSelectedOrder}
                        isClearable
                        placeholder="Order by..."
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
                        <button className="input-button" onClick={fetchRecords}>Proceed</button>
                    </div>
                </div>
                <div>
                <table className="records-table">
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
        </div>
    )
}