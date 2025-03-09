import '../../App.css'
import './records.css'
import Select from 'react-select'
import {useState} from 'react'

export default function RecordsProduction(){
    const sampleType = [
        { value: "Production", label: "Production" },
        { value: "Delivery", label: "Delivery" },
        { value: "Stalls", label: "Stalls" },
        { value: "Supply", label: "Supply" }
    ]
    
    const sampleTerms = [
        { value: "Daily", label: "Daily" },
        { value: "Weekly", label: "Weekly" },
        { value: "Monthly", label: "Monthly" }
    ]

    const order = [
        { value: "Ascending", label: "Ascending" },
        { value: "Descending", label: "Descending" },
    ]
    const [selectedType, setSelectedType] = useState(null);
    const [selectedTerm, setSelectedTerm] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);

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
                        options={sampleTerms}
                        value={selectedTerm}
                        onChange={setSelectedTerm}
                        isClearable
                        placeholder="Term"
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