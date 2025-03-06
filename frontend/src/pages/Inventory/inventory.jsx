import '../../App.css'
import {useState} from "react"
import Production from './production'
import Stalls from './stalls'

export default function Inventory(){
    const [activeTab, setActiveTab] = useState("Tab 1");
    return (
        <>  
            <div className="tabContainer">
                <button className={`tab ${activeTab === "Tab 1" ? "active" : "inactive"}`} onClick={() => setActiveTab("Tab 1")}>Production</button>
                <button className={`tab ${activeTab === "Tab 2" ? "active" : "inactive"}`} onClick={() => setActiveTab("Tab 2")}>Stalls</button>
            </div>
            <div>
                <div className="content">
                    {activeTab === "Tab 1" && <Production></Production>}
                    {activeTab === "Tab 2" && <Stalls></Stalls>}
                </div>
            </div>
        </>   
    )
}