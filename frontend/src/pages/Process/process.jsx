import '../../App.css'
import {useState} from "react"
import Production from './production.jsx'

export default function Process(){
    const [activeTab, setActiveTab] = useState("Tab 1");

    return(
      <>
        <div>
            <div className="tabContainer">
                <button className={`tab ${activeTab === "Tab 1" ? "active" : ""}`} onClick={() => setActiveTab("Tab 1")}>Production</button>
                <button className={`tab ${activeTab === "Tab 2" ? "active" : ""}`} onClick={() => setActiveTab("Tab 2")}>Tab 2</button>
            </div>
            <div className="content">
                {activeTab === "Tab 1" ? <Production/> : <h1>Content for Tab 2</h1>}
            </div>  
        </div>
      </>
        
    ) 
}