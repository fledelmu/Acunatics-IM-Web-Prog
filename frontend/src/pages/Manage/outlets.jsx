import '../../App.css'
import './manage.css'
import {useState} from 'react'
import CreatableSelect from 'react-select/creatable'
import Select from 'react-select'

export default function Outlets(){
    const actions = [
        {value: "Add", label: "Add"},
        {value: "Search", label: "Search"}
    ]
    const options = [
        {value: "Manager 1", label: "Manager 1"}
    ]

    const [selected, setSelected] = useState(null)

    const [selectedAction, setSelectedAction] = useState("Search")

    const [contact, setContact] = useState("")

    return(
        <div className='content'>
            <div><h2>Outlets</h2></div>
            <div className="manage-form-container">
                <Select
                className="selection"
                options={actions}
                value={selectedAction}
                onChange={(value) => setSelectedAction(value)}
                isClearable
                placeholder="Select action..."
                />
                <input placeholder="Enter location..."></input>
                <button className="input-button">Proceed</button>
            </div>
            
            <div className="manage-table-content">
                <table className="manage-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Product</th>
                            <th>Starting Weight</th>
                            <th>Ending Weight</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>1</td>
                            <td>Pork</td>
                            <td>10</td>
                            <td>10</td>
                        </tr>
                        <tr>
                            <td>2</td>
                            <td>Beef</td>
                            <td>5</td>
                            <td>10</td>
                        </tr>
                        <tr>
                            <td>3</td>
                            <td>Chicken</td>
                            <td>8</td>
                            <td>10</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
      
    )
}