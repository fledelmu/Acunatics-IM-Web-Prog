import { useState } from 'react'
import Inventory from './pages/Inventory/inventory'
import Process from './pages/Process/process'
import Records from './pages/Records/records'
import Manage from './pages/Manage/manage'
import logo from './assets/porkybest.png'
import './App.css'

function App() {
  const [activePage, setActivePage] = useState("process");

  return (
    <>
      <div className="sidebar">
        <img src={logo} alt="Sidebar Logo" className="sidebar-img"/>
        <h1>Production Manager</h1>
        <div className="sideButtonContainer">
          <button className={`sideButton ${activePage === "process" ? "active" : ""}`} onClick={() => setActivePage("process")}>Process</button>
          <button className={`sideButton ${activePage === "records" ? "active" : ""}`} onClick={() => setActivePage("records")}>Records</button>
          <button className={`sideButton ${activePage === "inventory" ? "active" : ""}`} onClick={() => setActivePage("inventory")}>Inventory</button>
          <button className={`sideButton ${activePage === "manage" ? "active" : ""}`} onClick={() => setActivePage("manage")}>Manage</button>
        </div>
      </div>

      <div className="contentContainer">
        {activePage === "process" && <Process></Process>}
        {activePage === "records" && <Records></Records>}
        {activePage === "inventory" && <Inventory></Inventory>}
        {activePage === "manage" && <Manage></Manage>}
      </div>
    </>
  )
}

export default App
