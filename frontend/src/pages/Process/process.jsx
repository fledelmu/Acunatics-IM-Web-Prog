import '../../App.css'
import {useState} from "react"
import Production from './production.jsx'
import Delivery from './delivery.jsx'
import Stalls from './stalls.jsx'
import Supply from './supply.jsx'

export default function Process(){
    const [activeTab, setActiveTab] = useState("Tab 1");

    return(
      <>
        <div>
            <div className="tabContainer">
                <button className={`tab ${activeTab === "Tab 1" ? "active" : "inactive"}`} onClick={() => setActiveTab("Tab 1")}>Production</button>
                <button className={`tab ${activeTab === "Tab 2" ? "active" : "inactive"}`} onClick={() => setActiveTab("Tab 2")}>Delivery</button>
                <button className={`tab ${activeTab === "Tab 3" ? "active" : "inactive"}`} onClick={() => setActiveTab("Tab 3")}>Stalls</button>
                <button className={`tab ${activeTab === "Tab 4" ? "active" : "inactive"}`} onClick={() => setActiveTab("Tab 4")}>Supply</button>
            </div>
            <div className="content">
                {activeTab === "Tab 1" && <Production/>}
                {activeTab === "Tab 2" && <Delivery/>}
                {activeTab === "Tab 3" && <Stalls/>}
                {activeTab === "Tab 4" && <Supply/>}
            </div>  
        </div>
      </>
        
    ) 
}