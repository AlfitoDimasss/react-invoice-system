const Invoice = require('./Invoice')
const InvoiceProduct = require('./InvoiceProduct')

Invoice.hasMany(InvoiceProduct, {foreignKey: 'invoiceId'})
InvoiceProduct.belongsTo(Invoice, {foreignKey: 'invoiceId'})

module.exports = {Invoice, InvoiceProduct}