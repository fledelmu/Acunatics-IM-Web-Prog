import '../../App.css'
import {useState} from "react"
import Add from './production-add'
import View from './production-view'
import Stalls from './stalls'

export default function Inventory(){
    const [activeTab, setActiveTab] = useState("Tab 1");
    return (
        <>  
            <div className="tabContainer">
                <button className={`tab ${activeTab === "Tab 1" ? "active" : "inactive"}`} onClick={() => setActiveTab("Tab 1")}>Add Production Inventory</button>
                <button className={`tab ${activeTab === "Tab 2" ? "active" : "inactive"}`} onClick={() => setActiveTab("Tab 2")}>View Production Inventory</button>
                <button className={`tab ${activeTab === "Tab 3" ? "active" : "inactive"}`} onClick={() => setActiveTab("Tab 3")}>Stalls Inventory</button>
            </div>
            <div>
                <div className="content">
                    {activeTab === "Tab 1" && <Add/>}
                    {activeTab === "Tab 2" && <View/>}
                    {activeTab === "Tab 3" && <Stalls/>}
                </div>
            </div>
        </>   
    )
}