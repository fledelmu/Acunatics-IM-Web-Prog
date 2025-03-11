import axios from 'axios'

const URL = "http://localhost:5000"

// Production Tab
export const processProduction = async (data) =>{
    try{
        const response = await axios.post(`${URL}/api/process-production`, data)

        return response.data
    } catch(error){
        console.error("Error processing production:", error)
        return { success: false, message: "Error processing production" }
    }
}

export const processDelivery = async (data) => {
    try{
        const response = await axios.post(`${URL}/api/process-delivery`,
            
        )

        return response.data
    } catch(error){
        console.error("Error processing delivery:", error)
        return { success: false, message: "Error processing delivery" }
    }
}

// Records Tabs
export const fetchRecords = async (type) =>{
    try{
        const response = await axios.get(`${URL}/api/${type}`)
        console.log("Response received:", response);

        return response.data
    } catch(error) {
        console.error("Error fetching records:", error);
        return []
    }
}

// Manage Tabs
export const addManager = async (data) => {
    try{
        const response = await axios.post(`${URL}/api/add-manager`, data)
        console.log("Response received", response)
        
        return response.data
    } catch (error) {
        console.error("Error processing manager:", error);
        return { success: false, message: "Error processing manager" }
    }
}

export const findManager = async (name) => {
    try{
        const response = await axios.get(`${URL}/api/search-manager`)

        return response.data
    } catch (error) {
        console.error("Error fetching managers!", error)
        return []
    }
}

export const fetchManagers = async () => {
    try{
        const response = await axios.get(`${URL}/api/get-manager`)

        return response.data
    } catch (error) {
        console.error("Error fetching managers!", error)
        return []
    }
}