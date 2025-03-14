import axios from 'axios'

const URL = "http://localhost:5000"

// Process Tabs
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
            data
        )

        return response.data
    } catch(error){
        console.error("Error processing delivery:", error)
        return { success: false, message: "Error processing delivery" }
    }
}

export const processSupply = async (data) => {
    try{
        const response = await axios.post(`${URL}/api/process-supply`, data)

        return response.data
    } catch(error){
        console.error("Error processing supply:", error)
        return { success: false, message: "Error processing supply" }
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

export const editSuppliers = async (editData) => {
    try {
        console.log("Sending data to backend:", editData) // Log the data being sent
        const response = await axios.put(`${URL}/api/manage-edit-suppliers`, editData, {
            headers: {
                'Content-Type': 'application/json'
            }
        })

        if (response.status !== 200) {
            throw new Error(`HTTP error! Status: ${response.status}`)
        }

        console.log("Response from backend:", response.data) // Log the response from the backend
        return response.data
    } catch (error) {
        console.error("Error editing supplier:", error)
        return null
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

export const editOutlet = async (editData) => {
    try {
        console.log("Sending data to backend:", editData); 
        const response = await axios.put(`${URL}/api/manage-edit-outlet`, editData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.status !== 200) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        console.log("Response from backend:", response.data); // Log the response from the backend
        return response.data;
    } catch (error) {
        console.error("Error editing outlet:", error);
        return null;
    }
};

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

export const editClient = async (editData) => {
    try {
        console.log("Sending data to backend:", editData); 
        const response = await axios.put(`${URL}/api/manage-edit-client`, editData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.status !== 200) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        console.log("Response from backend:", response.data); // Log the response from the backend
        return response.data;
    } catch (error) {
        console.error("Error editing client:", error);
        return null;
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

        console.log("Response from backend:", response.data);
        return response.data
    } catch (error) {
        console.error("Trouble finding product! ", error)
        return []
    }
}

export const editProduct = async (editData) => {
    try {
        console.log("Sending data to backend:", editData); 
        const response = await axios.put(`${URL}/api/manage-edit-product`, editData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.status !== 200) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        console.log("Response from backend:", response.data); // Log the response from the backend
        return response.data;
    } catch (error) {
        console.error("Error editing client:", error);
        return null;
    }
}

//Manage/Item
export const addItem = async (data) => {
    try{
        const response = await fetch(`${URL}/api/manage-add-item`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data), 
        })
        return response.data
    } catch (error) {
        console.error("Error processing item: ", error)
        return { success: false, message: "Error processing item" }
    }
}

export const getItems = async () => {
    try{
        const response = await axios.get(`${URL}/api/manage-get-item`)
        return response.data
    } catch (error ){
        console.error("Error retrieving items: ", error)
        return []
    }
}

export const searchItem = async (data) => {
    try{
        const response = await axios.get(`${URL}/api/manage-search-item`, {
            params: {name: data.name}
        })

        return response.data
    } catch (error) {
        console.error("Error, item not found: ", error)
        return []
    }
}

export const editItem = async (editData) => {
    try {
        console.log("Sending data to backend:", editData); 
        const response = await axios.put(`${URL}/api/manage-edit-item`, editData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.status !== 200) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        console.log("Response from backend:", response.data); // Log the response from the backend
        return response.data;
    } catch (error) {
        console.error("Error editing client:", error);
        return null;
    }
}
//Inventory 

export const addInventory = async (data) => {
    try{
        const response = await axios.post(`${URL}/api/inventory-add-production-inventory`, data)
        return response.data
    } catch (error){
        console.error("Error, inserting inventory: ", error)
        return []
    }
}

export const viewInventory = async () => {
    try{
        const response = await axios.get(`${URL}/api/inventory-view-production-inventory`)
        console.log("Inventory API response:", response.data)
        return response.data
    } catch (error) {
        console.error("Error retrieving inventory: ", error)
        return []
    }
}

export const viewStallsInv = async () => {
    try{
        const response = await axios.get(`${URL}/api/inventory-stalls-inventory`)
        console.log("Inventory response: ", response.data)
        return response.data
    } catch(error){
        console.error("Error retrieving inventory: ", error)
        return []
    }
}
