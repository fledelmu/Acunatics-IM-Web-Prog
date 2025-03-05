import { useState } from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Inventory from './pages/inventory';
import Process from './pages/process';
import Records from './pages/records';
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
