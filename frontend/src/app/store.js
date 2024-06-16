import {configureStore} from "@reduxjs/toolkit";
import invoiceReducer from "../features/invoices/invoiceSlice.js";
import invoiceListReducer from "../features/invoiceLists/invoiceListSlice.js";

const store = configureStore({
    reducer: {
        invoice: invoiceReducer,
        invoiceList: invoiceListReducer,
    }
})

export default store