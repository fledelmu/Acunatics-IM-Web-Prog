import '../../App.css'
import './records.css'
import Select from 'react-select'
import {useState} from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import {fetchRecords} from '../../utils/api'


export default function RecordsProduction(){
    const type = [
        { value: "Production", label: "Production" },
        { value: "Delivery", label: "Delivery" },
        { value: "Supply", label: "Supply" }
    ]

    const [selectedType, setSelectedType] = useState(null)

    const [selectedDate, setSelectedDate] = useState(null)
    const [records, setRecords] = useState([])
    const [columns, setColumns] = useState([])

    const fetchInfo = async () => {
        console.log("clicked");

        try {

            let data = []

            if(selectedType.value === 'Production'){
                data = await fetchRecords('production-records')
                console.log("Fetched data:", data)
            }
            
            if(selectedType === 'Delivery'){
                data = await fetchRecords('delivery-records')
                console.log("Fetched data:", data)
            }

            if(selectedType === 'Supply'){
                data = await fetchRecords('supply-records')
                console.log("Fetched data:", data)
            }

            if (!data || data.length === 0) {
                setColumns([])
                setRecords([])
                return
            }

            setColumns(Object.keys(data[0]))
            setRecords(data)
        } catch (error) {
            console.error("Fetching error:", error)
            setColumns([])
            setRecords([])
        }
    }
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
                <div className="records-table-container">
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