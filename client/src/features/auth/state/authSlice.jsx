import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axiosInstance from '../../../config/api.jsx'

export const registerUser = createAsyncThunk('auth/register', async (formData, { rejectWithValue }) => {
    try {
        const { data } = await axiosInstance.post('/auth/register', formData)
        return data
    } catch (error) {
        return rejectWithValue(error.response?.data ?? { message: 'Something went wrong' })
    }
})

export const loginUser = createAsyncThunk('auth/login', async (formData, { rejectWithValue }) => {
    try {
        const { data } = await axiosInstance.post('/auth/login', formData)
        return data
    } catch (error) {
        return rejectWithValue(error.response?.data ?? { message: 'Something went wrong' })
    }
})

export const fetchMe = createAsyncThunk('auth/me', async (_, { rejectWithValue }) => {
    try {
        const { data } = await axiosInstance.get('/auth/me')
        return data
    } catch (error) {
        return rejectWithValue(error.response?.data ?? { message: 'Something went wrong' })
    }
})

export const logoutUser = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
    try {
        const { data } = await axiosInstance.post('/auth/logout')
        return data
    } catch (error) {
        return rejectWithValue(error.response?.data ?? { message: 'Something went wrong' })
    }
})

const extractUser = (payload) => payload?.data?.user ?? null

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        fieldErrors: {},
    },
    reducers: {
        removeUser: (state) => {
            state.user = null
            state.isAuthenticated = false
        },
        clearErrors: (state) => {
            state.error = null
            state.fieldErrors = {}
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
                state.isLoading = true
                state.error = null
                state.fieldErrors = {}
            })
            .addCase(registerUser.fulfilled, (state) => {
                state.isLoading = false
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload?.message ?? 'Registration failed'
                state.fieldErrors = mapFieldErrors(action.payload)
            })

            .addCase(loginUser.pending, (state) => {
                state.isLoading = true
                state.error = null
                state.fieldErrors = {}
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false
                state.isAuthenticated = true
                state.user = extractUser(action.payload)
                localStorage.setItem('accessToken', action.payload?.data?.accessToken)
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false
                state.isAuthenticated = false
                state.error = action.payload?.message ?? 'Login failed'
                state.fieldErrors = mapFieldErrors(action.payload)
            })

            .addCase(fetchMe.pending, (state) => {
                state.isLoading = true
            })
            .addCase(fetchMe.fulfilled, (state, action) => {
                state.isLoading = false
                state.isAuthenticated = true
                state.user = extractUser(action.payload)
            })
            .addCase(fetchMe.rejected, (state) => {
                state.isLoading = false
                state.isAuthenticated = false
                state.user = null
                state.error = null
            })

            .addCase(logoutUser.pending, (state) => {
                state.isLoading = true
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.isLoading = false
                state.isAuthenticated = false
                state.user = null
                localStorage.removeItem('accessToken')
            })
            .addCase(logoutUser.rejected, (state) => {
                state.isLoading = false
                state.isAuthenticated = false
                state.user = null
                localStorage.removeItem('accessToken')
            })
    },
})

const mapFieldErrors = (payload) => {
    const fieldErrors = {}
    payload?.errors?.forEach(({ field, message }) => {
        if (!fieldErrors[field]) fieldErrors[field] = message
    })
    return fieldErrors
}

export const { removeUser, clearErrors } = authSlice.actions

export default authSlice.reducer
