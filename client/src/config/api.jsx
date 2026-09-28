import axios from 'axios'

const axiosInstance = axios.create({
    baseURL: `${import.meta.env.VITE_BASE_API_URI}/api`,
    withCredentials: true,
})

axiosInstance.interceptors.request.use((config) => {
    const accessToken = localStorage.getItem('accessToken')
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
})

let isRetrying = false

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config

        const isAuthCall = originalRequest.url.includes('/auth/')
        if (error.response?.status !== 401 || isRetrying || isAuthCall || originalRequest._retry) {
            return Promise.reject(error)
        }

        isRetrying = true
        originalRequest._retry = true

        try {
            const { data } = await axiosInstance.post('/auth/refresh-token')
            localStorage.setItem('accessToken', data.data.accessToken)

            isRetrying = false
            return axiosInstance(originalRequest)
        } catch (refreshError) {
            localStorage.removeItem('accessToken')
            isRetrying = false
            return Promise.reject(refreshError)
        }
    }
)

export default axiosInstance
