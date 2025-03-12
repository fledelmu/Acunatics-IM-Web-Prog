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
// Manage/Managers tab
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

export const findManager = async (data) => {
    try {
        const response = await axios.get(`${URL}/api/search-manager`, {
            params: { name: data.name }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching managers", error);
        return [];
    }
}


export const fetchManagers = async () => {
    try{
        const response = await axios.get(`${URL}/api/get-managers`)

        return response.data
    } catch (error) {
        console.error("Error fetching managers!", error)
        return []
    }
}

// Manage/Suppliers tab

export const fetchSuppliers = async () => {
    try{
        const response = await axios.get(`${URL}/api/manage-get-suppliers`)

        return response.data
    } catch (error) {
        console.error("Trouble retrieving suppliers!", error)
        return []
    }
}

export const searchSuppliers = async (data) => {
    try{
        const response = await axios.get(`${URL}/api/manage-search-suppliers`, {
            params: { name: data.name }
        });

        return response.data
    } catch (error) {
        console.error("Trouble searching suppliers!", error)
        return []
    }
}

export const addSuppliers = async (data) => {
    try{
        const response = await axios.post(`${URL}/api/manage-add-suppliers`, data)
        console.log("Response received", response)

        return response.data
    } catch (error) {
        console.error("Error processing suppliers:", error);
        return { success: false, message: "Error processing suppliers" }
    }
}

// Manage/Employees tab

export const addEmployee = async (data) => {
    try{
        const response = await axios.post(`${URL}/api/manage-add-employee`, data)
        console.log("Response received", response)

        return response.data
    } catch (error) {
        console.error("Error processing employees: ", error)
        return { success: false, message: "Error processing employees" }
    }
}

export const fetchEmployees = async () => {
    try{
        const response = await axios.get(`${URL}/api/manage-get-employee`)

        return response.data
    } catch (error) {
        console.error("Trouble retrieving employees!", error)
        return []
    }
}

export const searchEmployee = async (data) => {
    try{
        const response = await axios.get(`${URL}/api/manage-search-employee`, {
            params: { name: data.name }
        });

        return response.data
    } catch (error) {
        console.error("Trouble searching employees!", error)
        return []
    }
}

//Manage/Outlets
export const fetchOutlets = async () => {
    try{
        const response = await axios.get(`${URL}/api/manage-get-outlet`)

        return response.data
    } catch (error) {
        console.error("Trouble searching outlets!", error)
        return []
    }
}

export const searchOutlet = async (data) => {
    try{
        const response = await axios.get(`${URL}/api/manage-search-outlet`, {
            params : {location : data.location}
        })

        return  response.data
    } catch (error){
        console.error("Trouble searching outlet!", error)
        return []
    }
}

export const addOutlet = async (data) => {
    try{
        const response = await axios.post(`${URL}/api/manage-add-outlet`, data)

        return response.data
    } catch (error) {
        console.error("Trouble adding outlet!", error)
        return []
    }
}

//Manage/Clients
export const getClients = async () => {
    try{
        const response = await axios.get(`${URL}/api/manage-get-clients`)

        return response.data
    } catch (error) {
        console.error("Trouble finding client! ", error)
        return []
    }
}

export const searchClient = async (data) => {
    try{
        const response = await axios.get(`${URL}/api/manage-search-client`, {
            params: { name: data.name }
        })

        return response.data
    } catch (error) {
        console.error("Trouble finding client! ", error)
        return []
    }
}

export const addClient = async (data) => {
    try {
        console.log("Sending request to /api/manage-add-client with data:", data)
        const response = await axios.post(`${URL}/api/manage-add-client`, data)
        return response.data
    } catch (error) {
        console.error("Error processing client: ", error.response?.data || error.message)
        return { success: false, message: "Error processing client" }
    }
}

//Manage/Products

export const addProduct = async (data) => {
    try{
        const response = await axios.post(`${URL}/api/manage-add-product`, data)

        return response.data
    } catch (error) {
        console.error("Error processing product: ", error.response?.data || error.message)
        return { success: false, message: "Error processing product" }
    }
}

export const getProducts = async () => {
    try {
        const response = await axios.get(`${URL}/api/manage-get-product`)
        return response.data
    } catch (error) {
        console.error("Trouble finding products! ", error)
        return []
    }
}

export const searchProducts = async (data) => {
    try{
        const response = await axios.get(`${URL}/api/manage-search-product`, {
            params : {name : data.name}
        })

        return response.data
    } catch (error) {
        console.error("Trouble finding product! ", error)
        return []
    }
}
