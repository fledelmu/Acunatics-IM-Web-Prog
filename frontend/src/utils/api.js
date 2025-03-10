import axios from 'axios'
import {useState, useEffect} from 'react'

const URL = "http://localhost:5000"

export const getProduction = async () =>{
    try{
        const response = await axios.get(`${URL}/api/production-records`)
        return response.data
    } catch(error) {
        console.error("Error fetching records:", error);
        return []
    }
}