
import axios from "axios"


axios.defaults.baseURL = "http://localhost:8080"

// define content type for all methods globally
axios.defaults.headers.common["Content-Type"] = "application/json"

export const getAuthToken = () => {
    return window.localStorage.getItem("auth_token")
}

export const setAuthToken = (token) => {
    return window.localStorage.setItem("auth_token", token)
}

export const request = async (method, url, data = null) => {
    let headers = { ...axios.defaults.headers.common };

    if (getAuthToken() !== null && getAuthToken() !== "null") {
        headers["Authorization"] = `Bearer ${getAuthToken()}`
    }

    try {
        const response = await axios({ method, headers, url, data });
        return response;
    
    } catch (error) {
        if (error.response) {
            console.error("API Error Response:", error.response.data);
        } else if (error.request) {
            console.error("No Response Received:", error.request);
        } else {
            console.error("Error during request:", error.message);
        }
        throw error;
    }
};