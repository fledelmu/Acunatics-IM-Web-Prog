import '../../App.css'
import {useState} from "react"
import Production from './production.jsx'
import Delivery from './delivery.jsx'
import StallsSales from './stall-sales.jsx'
import Supply from './supply.jsx'

export default function Process(){
    const [activeTab, setActiveTab] = useState("Tab 1");

    return(
      <>
        <div>
            <div className="tabContainer">
                <button className={`tab ${activeTab === "Tab 1" ? "active" : "inactive"}`} onClick={() => setActiveTab("Tab 1")}>Production</button>
                <button className={`tab ${activeTab === "Tab 2" ? "active" : "inactive"}`} onClick={() => setActiveTab("Tab 2")}>Delivery</button>
                <button className={`tab ${activeTab === "Tab 3" ? "active" : "inactive"}`} onClick={() => setActiveTab("Tab 3")}>Supply</button>
                <button className={`tab ${activeTab === "Tab 4" ? "active" : "inactive"}`} onClick={() => setActiveTab("Tab 4")}>Stall Sales</button>
            </div>
            <div className="content">
                {activeTab === "Tab 1" && <Production/>}
                {activeTab === "Tab 2" && <Delivery/>}
                {activeTab === "Tab 3" && <Supply/>}
                {activeTab === "Tab 4" && <StallsSales/>}
            </div>  
        </div>
      </>
        
    ) 
}