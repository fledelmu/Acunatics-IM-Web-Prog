import '../../App.css'
import Select from 'react-select'
import {useState} from 'react'

export default function RecordsStalls(){
    const sampleOptions = [
        { value: "john_doe", label: "John Doe" },
        { value: "jane_smith", label: "Jane Smith" },
        { value: "alice_johnson", label: "Alice Johnson" }
    ];
    
    const [selectedOption, setSelectedOption] = useState(null);

    return(
        <div className="content">
            <div className="records-content">
                <div className="records-combobox-container">
                    <div className="records-combobox">
                        <Select
                        options={sampleOptions}
                        value={selectedOption}
                        onChange={setSelectedOption}
                        isClearable
                        placeholder="Choose a name..."
                        />
                    </div>
                    <div className="records-combobox">
                        <Select
                        options={sampleOptions}
                        value={selectedOption}
                        onChange={setSelectedOption}
                        isClearable
                        placeholder="Choose a name..."
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