import axios from "axios"

// Create an axios instance with default configuration
const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
})

// Add a request interceptor to include auth token in requests
api.interceptors.request.use(
  (config) => {
    // Skip auth for patient endpoints to allow public access
    if (config.url && (config.url.includes("/patients") || config.url.includes("/public"))) {
      return config
    }

    // Only run on client side
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token")
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Add a response interceptor for better error handling
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    console.error("API Error:", error.response?.data || error.message)
    return Promise.reject(error)
  },
)

export default api
