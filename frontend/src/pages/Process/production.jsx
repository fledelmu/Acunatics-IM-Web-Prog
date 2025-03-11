import '../../App.css'
import './process.css'
import CreatableSelect from 'react-select/creatable'
import {useState} from 'react'
import { processProduction, fetchRecords } from '../../utils/api'

export default function Production(){
    const options = [
        { value: "1", label: "1" },
        { value: "2", label: "2" },
        { value: "3", label: "3" },
        { value: "4", label: "4" },
        { value: "5", label: "5" }
    ]

    const [selected, setSelected] = useState(null)

    const addProduction = async () => {
        console.log(clicked);

        if (!selected || !totalWeight || !startWeight || !endWeight) {
            alert("Please fill in all fields");
            return;
        }

        const vat = selected.value; 
        const data = {
            vat,
            total_weight: totalWeight,
            start_weight: startWeight,
            end_weight: endWeight,
        };

        try{
            let data = []


        } catch (error) {

        }
    }
    return (
        <div className="content">
            <div><h2>Production Report</h2></div>
            <div className="form">
                <div><h3>Add Process:</h3></div>
               
                <CreatableSelect
                className="selection"
                options={options}
                value={selected}
                onChange={setSelected}
                isClearable
                placeholder="Vat Number"
                />
                
                <input placeholder='Enter total weight...'></input> 

                <input placeholder='Enter starting weight...'></input> 
                
                <input placeholder='Enter ending weight...'></input> 
                
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