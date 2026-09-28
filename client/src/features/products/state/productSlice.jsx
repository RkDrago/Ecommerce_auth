import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axiosInstance from '../../../config/api.jsx'

export const fetchProducts = createAsyncThunk('products/fetch', async (params = {}, { rejectWithValue }) => {
    try {
        const { data } = await axiosInstance.get('/products', { params })
        return data
    } catch (error) {
        return rejectWithValue(error.response?.data ?? { message: 'Failed to load products' })
    }
})

export const createProduct = createAsyncThunk('products/create', async (formData, { rejectWithValue }) => {
    try {
        const { data } = await axiosInstance.post('/products', formData)
        return data
    } catch (error) {
        return rejectWithValue(error.response?.data ?? { message: 'Failed to create product' })
    }
})

export const updateProduct = createAsyncThunk('products/update', async ({ id, formData }, { rejectWithValue }) => {
    try {
        const { data } = await axiosInstance.put(`/products/${id}`, formData)
        return data
    } catch (error) {
        return rejectWithValue(error.response?.data ?? { message: 'Failed to update product' })
    }
})

export const deleteProduct = createAsyncThunk('products/delete', async (id, { rejectWithValue }) => {
    try {
        const { data } = await axiosInstance.delete(`/products/${id}`)
        return data
    } catch (error) {
        return rejectWithValue(error.response?.data ?? { message: 'Failed to delete product' })
    }
})

const initialState = {
    products: [],
    listVersion: 0,
    pagination: { total: 0, page: 1, limit: 10, totalPages: 1 },
    isLoading: false,
    isSubmitting: false,
    error: null,
    actionError: null,
    fieldErrors: {},
    message: null,
}

const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        clearProductErrors: (state) => {
            state.error = null
            state.actionError = null
            state.fieldErrors = {}
        },
        clearMessage: (state) => {
            state.message = null
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.isLoading = false
                state.products = action.payload?.data?.products ?? []
                state.pagination = action.payload?.data?.pagination ?? initialState.pagination
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload?.message ?? 'Failed to load products'
            })

            .addCase(createProduct.pending, (state) => {
                state.isSubmitting = true
                state.actionError = null
                state.fieldErrors = {}
            })
            .addCase(createProduct.fulfilled, (state, action) => {
                state.isSubmitting = false
                state.listVersion += 1
                state.message = action.payload?.message ?? 'Product created'
            })
            .addCase(createProduct.rejected, (state, action) => {
                state.isSubmitting = false
                state.actionError = action.payload?.message ?? 'Failed to create product'
                state.fieldErrors = mapFieldErrors(action.payload)
            })

            .addCase(updateProduct.pending, (state) => {
                state.isSubmitting = true
                state.actionError = null
                state.fieldErrors = {}
            })
            .addCase(updateProduct.fulfilled, (state, action) => {
                state.isSubmitting = false
                state.listVersion += 1
                state.message = action.payload?.message ?? 'Product updated'
            })
            .addCase(updateProduct.rejected, (state, action) => {
                state.isSubmitting = false
                state.actionError = action.payload?.message ?? 'Failed to update product'
                state.fieldErrors = mapFieldErrors(action.payload)
            })

            .addCase(deleteProduct.pending, (state) => {
                state.isSubmitting = true
            })
            .addCase(deleteProduct.fulfilled, (state) => {
                state.isSubmitting = false
                state.listVersion += 1
                state.message = 'Product deleted successfully'
            })
            .addCase(deleteProduct.rejected, (state, action) => {
                state.isSubmitting = false
                state.actionError = action.payload?.message ?? 'Failed to delete product'
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

export const { clearProductErrors, clearMessage } = productSlice.actions

export default productSlice.reducer
