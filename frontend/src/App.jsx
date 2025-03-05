import { useState } from 'react'
import Inventory from './pages/Inventory/inventory';
import Process from './pages/Process/process';
import Records from './pages/Records/records';
import placeHolder from './assets/image-placeholder.png'
import './App.css'

function App() {
  const [activePage, setActivePage] = useState("process");

  return (
    <>
      <div className="sidebar">
        <img src={placeHolder} alt="Sidebar Logo"/>
        <h1>Porky Best!</h1>
        <div className="sideButtonContainer">
          <button className="sideButton" onClick={() => setActivePage("process")}>Process</button>
          <button className="sideButton" onClick={() => setActivePage("records")}>Records</button>
          <button className="sideButton" onClick={() => setActivePage("inventory")}>Inventory</button>
        </div>
      </div>

      <div className="contentContainer">
        {activePage === "process" && <Process></Process>}
        {activePage === "records" && <Records></Records>}
        {activePage === "inventory" && <Inventory></Inventory>}
      </div>
    </>
  )
}

export default App
