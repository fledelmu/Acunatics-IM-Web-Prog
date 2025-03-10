import '../../App.css'
import './records.css'
import Select from 'react-select'
import {useState} from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

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
                        <button className="input-button">Proceed</button>
                    </div>
                </div>
                <div>
                    <table className="records-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Age</th>
                                <th>Gender</th>
                                <th>Department</th>
                                <th>Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>John Doe</td>
                                <td>30</td>
                                <td>Male</td>
                                <td>IT</td>
                                <td>john.doe@example.com</td>
                            </tr>
                            <tr>
                                <td>Jane Smith</td>
                                <td>27</td>
                                <td>Female</td>
                                <td>HR</td>
                                <td>jane.smith@example.com</td>
                            </tr>
                            <tr>
                                <td>Alice Johnson</td>
                                <td>35</td>
                                <td>Female</td>
                                <td>Finance</td>
                                <td>alice.johnson@example.com</td>
                            </tr>
                            <tr>
                                <td>Michael Brown</td>
                                <td>40</td>
                                <td>Male</td>
                                <td>Marketing</td>
                                <td>michael.brown@example.com</td>
                            </tr>
                            <tr>
                                <td>Robert Wilson</td>
                                <td>29</td>
                                <td>Male</td>
                                <td>Sales</td>
                                <td>robert.wilson@example.com</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}