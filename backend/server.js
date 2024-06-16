const express = require('express')
const bodyParser = require('body-parser')
const mysql = require('mysql')
const cors = require('cors')

const app = express()
app.use(bodyParser.json())
app.use(cors())

// MySQL Config
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'widatech_submission'
})

// Connect DB
db.connect(err => {
    if (err) throw err;
    console.log('MySQL Connected...');
});

// Route for POST invoice
app.post('/api/invoices', (req, res) => {
    const {date, customer_name, salesperson_name, notes, products} = req.body;

    if (!date || !customer_name || !salesperson_name || !products.length) {
        return res.status(400).send('All mandatory fields must be filled');
    }

    const invoiceQuery = 'INSERT INTO invoices (date, customer_name, salesperson_name, notes) VALUES (?, ?, ?, ?)';
    db.query(invoiceQuery, [date, customer_name, salesperson_name, notes], (err, result) => {
        if (err) throw err;

        const invoiceId = result.insertId;

        const productQueries = products.map(product => {
            return new Promise((resolve, reject) => {
                const {product_name, product_picture, production_price, selling_price, quantity} = product;
                const productQuery = 'INSERT INTO invoice_products (invoice_id, product_name, product_picture, production_price, selling_price, quantity) VALUES (?, ?, ?, ?, ?, ?)';
                db.query(productQuery, [invoiceId, product_name, product_picture, production_price, selling_price, quantity], (err, result) => {
                    if (err) return reject(err);
                    resolve(result);
                });
            });
        });

        Promise.all(productQueries)
            .then(() => {
                res.status(201).send('Invoice created successfully');
            })
            .catch(err => {
                res.status(500).send('Error saving products');
            });
    });
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});