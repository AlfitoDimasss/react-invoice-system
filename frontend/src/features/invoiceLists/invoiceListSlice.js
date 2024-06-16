import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';

// Redux slice for InvoiceList

// Setup function to fetch all invoices from server
export const fetchInvoices = createAsyncThunk(
    'invoices/fetchInvoices',
    async ({page, size}) => {
        const response = await axios.get(`http://localhost:3000/api/invoices?page=${page}&size=${size}`);
        return response.data;
    }
);

// Define slice for invoiceList state
const invoiceListSlice = createSlice({
    name: 'invoiceList',
    initialState: {
        invoices: [],
        totalItems: 0,
        totalPages: 0,
        currentPage: 0,
        loading: false,
        error: null
    },
    reducers: {},
    // Define builder extra reducer for fetching status
    extraReducers: (builder) => {
        builder.addCase(fetchInvoices.pending, (state) => {
            console.log('Pending')
            state.loading = true;
        }).addCase(fetchInvoices.fulfilled, (state, action) => {
            console.log('Fulfilled')
            state.invoices = action.payload.invoices;
            state.totalItems = action.payload.totalItems;
            state.totalPages = action.payload.totalPages;
            state.currentPage = action.payload.currentPage;
            state.loading = false;
            console.log(state.invoices)
        }).addCase(fetchInvoices.rejected, (state, action) => {
            console.log('rejected')
            state.loading = false;
            state.error = action.error.message;
        })
    }
});

export default invoiceListSlice.reducer;
