import '../../App.css'
import {useState} from "react"
import RecordContent from './recordContent'

export default function Records(){
    const [activeTab, setActiveTab] = useState("Tab 1");
    return (
        <>  
            <div className="tabContainer">
                <button className="tab">Records</button>

            </div>
            <div>
                <div className="content">
                    {activeTab === "Tab 1" && <RecordContent></RecordContent>}
                </div>
            </div>
        </>   
    )
}