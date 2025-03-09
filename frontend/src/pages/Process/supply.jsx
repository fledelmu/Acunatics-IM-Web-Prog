import '../../App.css'
import {useState} from "react"
import CreatableSelect from 'react-select/creatable'

export default function Supply(){
    const options = [
        { value: "Person 1", label: "Person 1" }
    ]

    const units = [
        { value: "kg", label: "kg" },
        { value: "pcs", label: "pcs" },
        { value: "g", label: "g" }
    ]

    const [selected, setSelected] = useState(null)

    const [selectedUnit, setSelectedUnit] = useState(null)

    return(
        <div className="content">
            <div><h2>Supply Report</h2></div>
            <div className="form">
                <div><h3>Add Process:</h3></div>
                <div className="formInput">
                    <CreatableSelect
                    className="selection"
                    options={options}
                    value={selected}
                    onChange={setSelected}
                    isClearable
                    placeholder="Supplier"
                    />
                </div>
                <div className="formInput">
                    <input placeholder="quantity"></input>
                </div>
                <div className="formInput">
                    <input placeholder="price"></input>
                </div>
                <div className="formInput">
                    <CreatableSelect
                    className="selection"
                    options={units}
                    value={selectedUnit}
                    onChange={setSelectedUnit}
                    isClearable
                    placeholder="Unit"
                    />
                </div>
                <button className="input-button">Add</button>
            </div> 
            <div className="tableContent">
                
                <table className="process-table">
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