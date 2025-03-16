import '../../App.css'
import {useState} from "react"
import Items from './items'
import Suppliers from './suppliers'
import Products from './products'
import Clients from './clients'

export default function Manage(){
    const [activeTab, setActiveTab] = useState("Tab 1");

    return(
      <>
        <div>
            <div className="tabContainer">
                <button className={`tab ${activeTab === "Tab 1" ? "active" : "inactive"}`} onClick={() => setActiveTab("Tab 1")}>Suppliers</button>
                <button className={`tab ${activeTab === "Tab 2" ? "active" : "inactive"}`} onClick={() => setActiveTab("Tab 2")}>Clients</button>
                <button className={`tab ${activeTab === "Tab 3" ? "active" : "inactive"}`} onClick={() => setActiveTab("Tab 3")}>Products</button>
                <button className={`tab ${activeTab === "Tab 4" ? "active" : "inactive"}`} onClick={() => setActiveTab("Tab 4")}>Items</button>
            </div>
            <div className="content">
                {activeTab === "Tab 1" && <Suppliers/>}
                {activeTab === "Tab 2" && <Clients/>}
                {activeTab === "Tab 3" && <Products/>}
                {activeTab === "Tab 4" && <Items/>}
            </div>  
        </div>
      </>
        
    ) 
}