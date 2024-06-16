import React, {useState} from 'react';
import axios from 'axios';
import {FaCirclePlus} from 'react-icons/fa6'
import {useDispatch, useSelector} from "react-redux";

import {productData} from "../data/products.js";
import {
    setDate,
    setCustomerName,
    setSalespersonName,
    setNotes,
    resetInvoice,
    addProduct
} from '../features/invoices/invoiceSlice.js'

import {fetchInvoices} from "../features/invoiceLists/invoiceListSlice.js";
import {toast} from "react-toastify";

const InvoiceForm = ({handleToggleShowForm}) => {
    const [productInput, setProductInput] = useState('');
    const [productSuggestions, setProductSuggestions] = useState([]);

    const dispatch = useDispatch()
    const {date, customerName, salespersonName, notes, products} = useSelector(state => state.invoice)

    const handleProductChange = (e) => {
        setProductInput(e.target.value);
        if (e.target.value.length > 1) {
            const suggestions = productData.filter(product =>
                product.productName.toLowerCase().includes(e.target.value.toLowerCase())
            );
            setProductSuggestions(suggestions);
        } else {
            setProductSuggestions([]);
        }
    };

    const handleAddProduct = (product) => {
        if (products.find(item => item.productName === product.productName)) {
            dispatch(addProduct(products.map(item => item.productName === product.productName ? {
                ...item,
                quantity: item.quantity + 1
            } : item)))
        } else {
            dispatch(addProduct([...products, {...product, quantity: 1}]))
        }
        setProductInput('');
        setProductSuggestions([]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!date || !customerName || !salespersonName || !products.length) {
            alert('All mandatory fields must be filled');
            return;
        }

        console.log(date,
            customerName,
            salespersonName,
            notes,
            products)

        try {
            await axios.post('http://localhost:3000/api/invoices', {
                date,
                customerName,
                salespersonName,
                notes,
                products
            });
            toast('Invoice created successfully')
            // alert();
            dispatch(resetInvoice())
            handleToggleShowForm()
            dispatch(fetchInvoices({page: 0, size: 6}));
        } catch (error) {
            alert('Error creating invoice');
        }
    };

    return (
        <div className='content w-full border-2 border-blue-500 rounded p-5 my-10 bg-white'>
            <h1 className='text-2xl font-bold text-center mb-5'>Create Invoice</h1>
            <form className='space-y-6' onSubmit={handleSubmit}>
                <div>
                    <label className='block text-base font-medium leading-6 text-gray-900 mb-2'>Date</label>
                    <input type="date"
                           className='block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 py-2 px-4'
                           value={date} onChange={(e) => dispatch(setDate(e.target.value))} required/>
                </div>
                <div>
                    <label className='block text-base font-medium leading-6 text-gray-900 mb-2'>Customer Name</label>
                    <input type="text"
                           className='block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 py-2 px-4'
                           value={customerName} onChange={(e) => dispatch(setCustomerName(e.target.value))}
                           placeholder='John'
                           required/>
                </div>
                <div>
                    <label className='block text-base font-medium leading-6 text-gray-900 mb-2'>Salesperson Name</label>
                    <input type="text"
                           className='block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 py-2 px-4'
                           value={salespersonName} onChange={(e) => dispatch(setSalespersonName(e.target.value))}
                           placeholder='Doe'
                           required/>
                </div>
                <div>
                    <label className='block text-base font-medium leading-6 text-gray-900 mb-2'>Notes</label>
                    <textarea
                        className='block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 py-2 px-4'
                        value={notes} onChange={(e) => dispatch(setNotes(e.target.value))}
                        placeholder='Notes about this Invoice..'></textarea>
                </div>
                <div>
                    <label className='block text-base font-medium leading-6 text-gray-900 mb-2'>Add Products</label>
                    <input type="text"
                           className='block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 py-2 px-4'
                           value={productInput} onChange={handleProductChange}/>
                    <div>
                        {productSuggestions.map((product) => (
                            <div key={product.productName}>
                                <div
                                    className='border-2 border-blue-500 p-2 my-2 rounded-lg flex justify-between items-center'>
                                    <div>{product.productName} - Rp {product.sellingPrice}</div>
                                    <FaCirclePlus className='text-blue-500 text-xl cursor-pointer'
                                                  onClick={() => handleAddProduct(product)}/>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                {products.length > 0 && (
                    <div>
                        <p className='text-base font-medium leading-6 text-gray-900 mb-2'>Selected Product</p>

                        <div className="relative overflow-x-auto rounded-lg">
                            <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                                <thead
                                    className="text-xs text-gray-700 uppercase bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3">
                                        Product Name
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Product Image
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Product Price
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Quantity
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Total
                                    </th>
                                </tr>
                                </thead>
                                <tbody>
                                {products.map(product => (
                                    <tr className="bg-white border-b" key={product.productName}>
                                        <th scope="row"
                                            className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"> {product.productName}
                                        </th>
                                        <td className="px-6 py-4">
                                            <img src={product.productPicture} alt={product.productName}
                                                 className='w-20'/>
                                        </td>
                                        <td className="px-6 py-4">
                                            {product.sellingPrice}
                                        </td>
                                        <td className="px-6 py-4">
                                            {product.quantity}
                                        </td>
                                        <td className="px-6 py-4">
                                            {product.sellingPrice * product.quantity}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
                <button type="submit"
                        className="flex w-full justify-center rounded-md bg-blue-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500">Submit
                </button>
            </form>
        </div>
    );
};

export default InvoiceForm;
