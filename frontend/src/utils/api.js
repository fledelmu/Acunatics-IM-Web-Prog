import axios from 'axios'
import {useState, useEffect} from 'react'

const URL = "http://localhost:5000"

// Production Tab
export const processProduction = async (vat, total_weight, start_weight, end_weight) =>{
    try{
        const response = await axios.post(`${URL}/api/process-production`,{
            vat, 
            total_weight, 
            start_weight, 
            end_weight
        })

        return response.data
    } catch(error){
        console.error("Error processing production:", error)
        return { success: false, message: "Error processing production" };
    }
}

// Records Tabs
export const fetchRecords = async (type) =>{
    try{
        const response = await axios.get(`${URL}/api/${type}`)
        console.log("Response received:", response);
        const data = await response.data
        console.log("Data:", data);
        return data
    } catch(error) {
        console.error("Error fetching records:", error);
        return []
    }
}