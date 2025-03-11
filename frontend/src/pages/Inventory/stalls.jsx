import '../../App.css'
import './inventory.css'
import CreatableSelect from 'react-select/creatable'
import {useState} from 'react'

export default function InvStall(){
    const sampleLocation = [
        { value: "NCCC", label: "NCCC" },
        { value: "SM Ecoland", label: "SM Ecoland" },
        { value: "Gmall Bajada", label: "Gmall Bajada" }
    ]

    const [selectedLocation, setSelectedLocation] = useState(null);

    return(
        <div className="content">
            
            <div className="inventory-form-container">
                <div><h2>Stalls Inventory</h2></div>
                <div className="inventory-form">
                    <div>
                        <CreatableSelect
                            className="selection"
                            options={sampleLocation}
                            value={selectedLocation}
                            onChange={setSelectedLocation}
                            isClearable
                            placeholder="Location"
                        />
                    </div>
                </div>
                
                <div className="tableContent">
                    <table className="inventory-table">
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