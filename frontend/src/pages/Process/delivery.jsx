import '../../App.css'
import './process.css'
import {useState} from 'react'
import CreatableSelect from 'react-select/creatable'

export default function Delivery(){
    const options = [
        { value: "Material", label: "Material" }
    ]

    const [selected, setSelected] = useState(null)
    
    return (
        <div className="content">
            <div><h2>Deliver Report</h2></div>
            <div className="form">
                <div><h3>Add Process:</h3></div>
                <div className="formInput">
                        <CreatableSelect
                        className="selection"
                        options={options}
                        value={selected}
                        onChange={setSelected}
                        isClearable
                        placeholder="Location"
                        />
                    </div>
                    <div className="formInput">
                        <CreatableSelect
                        className="selection"
                        options={options}
                        value={selected}
                        onChange={setSelected}
                        isClearable
                        placeholder="Product"
                        />
                    </div>
                    <div className="formInput">
                        <input placeholder="Enter Total Delivery"></input> 
                    </div>
                    <div className="formInput">
                        <input placeholder="Enter Total Return"></input>
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