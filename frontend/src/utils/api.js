import axios from 'axios'
import {useState, useEffect} from 'react'

const URL = "http://localhost:5000"

export const fetchRecords = async () =>{
    try{
        const response = await axios.get(`${URL}/api/production-records`)
        console.log("Response received:", response);
        const data = await response.data
        console.log("Data:", data);
        return data
    } catch(error) {
        console.error("Error fetching records:", error);
        return []
    }
}