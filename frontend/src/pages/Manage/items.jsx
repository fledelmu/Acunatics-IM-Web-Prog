import '../../App.css'
import './manage.css'
import {useState} from 'react'
import CreatableSelect from 'react-select/creatable'
import Select from 'react-select'

export default function Items(){
    const actions = [
        {value: "Add", label: "Add"},
        {value: "Search", label: "Search"}
    ]
    const options = [
        {value: "Manager 1", label: "Manager 1"}
    ]
    const units = [
        {value: "g", label: "grams"}
    ]
    const [selected, setSelected] = useState(null)

    const [selectedAction, setSelectedAction] = useState("Search")

    const [selectedUnit, setSelectedUnit] = useState(null)

    return(
        <div className='content'>
            <div><h2>Items</h2></div>
            <div className="manage-form-container">
                <Select
                className="selection"
                options={actions}
                value={selectedAction}
                onChange={(value) => setSelectedAction(value)}
                isClearable
                placeholder="Select action..."
                />
                <CreatableSelect
                className="nameSelect"
                options={options}
                value={selected}
                onChange={setSelected}
                isClearable
                placeholder="Name"
                />
                {selectedAction?.value === "Add" && (
                    <div className="manage-form-container">
                        <label>Unit:</label>
                        <Select
                            className="selection"
                            option={units} 
                            value={selectedUnit} 
                            onChange={setSelectedUnit} 
                            placeholder="Choose unit"
                        />
                    </div>
                )}
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