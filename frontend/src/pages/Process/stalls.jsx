import '../../App.css'
import './process.css'
import CreatableSelect from 'react-select/creatable'
import {useState} from 'react'

export default function Stalls(){
    const options = [
        { value: "Material", label: "Material" }
    ]

    const [selected, setSelected] = useState(null)

    return (
        <div className="content">
            <div><h2>Stalls Report</h2></div>
            <div className="form">
                <div><h3>Add Process:</h3></div>
                
                    <CreatableSelect
                    className="selection"
                    options={options}
                    value={selected}
                    onChange={setSelected}
                    isClearable
                    placeholder="Outlet"
                    />
                
                
                    <CreatableSelect
                    className="selection"
                    options={options}
                    value={selected}
                    onChange={setSelected}
                    isClearable
                    placeholder="Product"
                    />
                
                    <input placeholder="Enter Total Delivery"></input> 
                
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