import '../../App.css'
import './inventory.css'
import {useState} from "react"
import Select from 'react-select'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

export default function InvProduction(){
    const Type = [
        { value: "Material", label: "Material" },
        { value: "Product", label: "Product" },
    ]

    const [getSelected, setSelected] = useState(null)

    const product = [
        { value: "Chicharon 1", label: "Chicharon 1" }
    ]

    const [selectedProd, setSelectedProd] = useState(null)

    const [selectedDate, setSelectedDate] = useState(null)
    
    return(
        <>
            <div className="content">
                
                <div className="inventory-form-container">
                    <div><h2>Production Inventory</h2></div>
                    <div className="inventory-form">
                        <div>
                            <Select
                            className="selection"
                            options={Type} 
                            value={getSelected}
                            onChange={setSelected}
                            isClearable
                            placeholder="Type"
                            />
                        </div>
                        <div>
                            <label><h3>{getSelected ? (getSelected.value === 'Material' ? 'Item:' : 'Product:') : 'Item:'}</h3></label>
                        </div>  
                        <div>
                            <Select
                            className="selection"
                            options={product}
                            value={selectedProd}
                            onChange={setSelectedProd}
                            isClearable
                            placeholder= {getSelected ? (getSelected.value === 'Material' ? 'Item' : 'Product') : 'Item'}
                            />
                        </div>
                        <label><h3>Pick Date</h3></label>
                        <div>
                            <DatePicker 
                            selected={selectedDate} 
                            onChange={(date) => setSelectedDate(date)} 
                            dateFormat="yyyy-MM-dd" 
                            isClearable
                            placeholderText="Select a date"
                            />
                        </div>
                    </div>
                    <div className="tableContent">
                        <table className="inventory-table">
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
                
            </div>
        </>
        
    )
}