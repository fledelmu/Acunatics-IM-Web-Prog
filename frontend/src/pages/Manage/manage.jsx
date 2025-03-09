import '../../App.css'
import {useState} from "react"
import Managers from './managers'
import Items from './items'
import Suppliers from './suppliers'
import Products from './products'
import Outlets from './outlets'
import Employees from './employees'

export default function Manage(){
    const [activeTab, setActiveTab] = useState("Tab 1");

    return(
      <>
        <div>
            <div className="tabContainer">
                <button className={`tab ${activeTab === "Tab 1" ? "active" : "inactive"}`} onClick={() => setActiveTab("Tab 1")}>Managers</button>
                <button className={`tab ${activeTab === "Tab 2" ? "active" : "inactive"}`} onClick={() => setActiveTab("Tab 2")}>Suppliers</button>
                <button className={`tab ${activeTab === "Tab 3" ? "active" : "inactive"}`} onClick={() => setActiveTab("Tab 3")}>Employees</button>
                <button className={`tab ${activeTab === "Tab 4" ? "active" : "inactive"}`} onClick={() => setActiveTab("Tab 4")}>Outlets</button>
                <button className={`tab ${activeTab === "Tab 5" ? "active" : "inactive"}`} onClick={() => setActiveTab("Tab 5")}>Products</button>
                <button className={`tab ${activeTab === "Tab 6" ? "active" : "inactive"}`} onClick={() => setActiveTab("Tab 6")}>Items</button>
            </div>
            <div className="content">
                {activeTab === "Tab 1" && <Managers/>}
                {activeTab === "Tab 2" && <Suppliers/>}
                {activeTab === "Tab 3" && <Employees/>}
                {activeTab === "Tab 4" && <Outlets/>}
                {activeTab === "Tab 5" && <Products/>}
                {activeTab === "Tab 6" && <Items/>}
            </div>  
        </div>
      </>
        
    ) 
}