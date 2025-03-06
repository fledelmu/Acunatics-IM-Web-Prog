import '../../App.css'
import {useState} from "react"
import Production from './production.jsx'
import Delivery from './delivery.jsx'
import Stalls from './stalls.jsx'

export default function Process(){
    const [activeTab, setActiveTab] = useState("Tab 1");

    return(
      <>
        <div>
            <div className="tabContainer">
                <button className={`tab ${activeTab === "Tab 1" ? "active" : "inactive"}`} onClick={() => setActiveTab("Tab 1")}>Production</button>
                <button className={`tab ${activeTab === "Tab 2" ? "active" : "inactive"}`} onClick={() => setActiveTab("Tab 2")}>Delivery</button>
                <button className={`tab ${activeTab === "Tab 3" ? "active" : "inactive"}`} onClick={() => setActiveTab("Tab 3")}>Stalls</button>
            </div>
            <div className="content">
                {activeTab === "Tab 1" && <Production/>}
                {activeTab === "Tab 2" && <Delivery/>}
                {activeTab === "Tab 3" && <Stalls/>}
            </div>  
        </div>
      </>
        
    ) 
}