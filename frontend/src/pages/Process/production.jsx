import '../../App.css'
import './process.css'
import Select from 'react-select'
import {useState} from 'react'

export default function Production(){
    const options = [
        { value: "Material", label: "Material" }
    ]

    const [selected, setSelected] = useState(null)

    return (
        <div className="content">
            <div><h2>Production Report</h2></div>
            <div className="form">
                <div><h3>Add Process:</h3></div>
                <Select
                className="selection"
                options={options}
                value={selected}
                onChange={setSelected}
                isClearable
                placeholder="Product"
                />
                
               
                <Select
                className="selection"
                options={options}
                value={selected}
                onChange={setSelected}
                isClearable
                placeholder="Vat Number"
                />
                
                <input placeholder='Enter Starting Weight'></input> 
                
                <input placeholder='Enter Ending Weight'></input> 
                
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