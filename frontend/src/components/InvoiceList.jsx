import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import Modal from 'react-modal'

import {fetchInvoices} from "../features/invoiceLists/invoiceListSlice.js";

Modal.setAppElement('#root')

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width: '33%',
        borderRadius: '10px'
    },
};

const InvoiceList = ({handleToggleShowForm, showForm, children}) => {
    const dispatch = useDispatch();
    const {invoices, totalPages, currentPage, loading, error} = useSelector((state) => state.invoiceList);

    const [modalIsOpen, setModalIsOpen] = useState(false)
    const [modalInvoice, setModalInvoice] = useState({})

    useEffect(() => {
        dispatch(fetchInvoices({page: 0, size: 6}));
    }, [dispatch]);

    const handleToggleModal = (invoice = {}) => {
        setModalIsOpen(prevState => !prevState)
        setModalInvoice(invoice)
        console.log(modalInvoice)
        console.log(modalIsOpen)
    }

    const handlePageChange = (page) => {
        dispatch(fetchInvoices({page, size: 6}));
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className='w-2/5 border-2 border-blue-500 rounded p-5 my-10'>
            <h2 className='text-3xl font-bold text-center w-full mb-5'>Invoices List</h2>
            <div className='w-full flex justify-center items-center mb-5'>
                {showForm ? (
                    <button type='button'
                            className='bg-red-500 px-4 py-2 rounded-lg text-white text-sm border'
                            onClick={() => handleToggleShowForm()}>Hide Invoice Form
                    </button>
                ) : (
                    <button type='button'
                            className='bg-blue-500 px-4 py-2 rounded-lg text-white text-sm border'
                            onClick={() => handleToggleShowForm()}>Show Invoice Form
                    </button>
                )}

            </div>
            {children}
            <div className="flex flex-wrap justify-evenly">
                {invoices.map((invoice) => (
                    <div key={invoice.id} className="border-blue-500 border p-4 rounded mb-4 w-48 hover:shadow-lg"
                         onClick={() => handleToggleModal(invoice)}>
                        <h2 className='font-semibold text-xl mb-2'>Invoice #{invoice.id}</h2>
                        <p className='text-xs text-slate-500'>Customer Name</p>
                        <h3 className='font-semibold text-sm mb-2'>{invoice.customerName}</h3>
                        <p className='text-xs text-slate-500'>Salesperson Name</p>
                        <h3 className='font-semibold text-sm mb-2'>{invoice.salespersonName}</h3>
                        <p className='text-xs text-slate-500'>Total Amount</p>
                        <h3 className='font-semibold text-sm mb-2'>${invoice.invoice_products.reduce((total, product) => total + (product.sellingPrice * product.quantity), 0)}</h3>
                        <p className='text-xs text-slate-500'>Notes</p>
                        <h3 className='font-semibold text-sm mb-2'>{invoice.notes}</h3>
                    </div>
                ))}
            </div>
            <div className="flex justify-center gap-2">
                {[...Array(totalPages).keys()].map((page) => (
                    <button key={page} onClick={() => handlePageChange(page)}
                            className='bg-blue-500 px-2 py-1 rounded text-white'>
                        {page + 1}
                    </button>
                ))}
            </div>
            <Modal
                isOpen={modalIsOpen}
                style={customStyles}
                contentLabel="Example Modal"
            >
                <div className='flex justify-between items-center mb-5'>
                    <h3 className='text-xl font-bold'>Invoice Product Detail</h3>
                    <button onClick={handleToggleModal}
                            className='bg-blue-500 px-2 py-1 text-xs text-white rounded-full'>X
                    </button>
                </div>
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
                        {modalInvoice.invoice_products && modalInvoice.invoice_products.map(product => (
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

            </Modal>
        </div>
    );
};

export default InvoiceList;
