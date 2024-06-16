const {Sequelize} = require('sequelize')

const sequelize = new Sequelize('widatech_submission_2', 'root', 'root', {
    host: 'localhost',
    dialect: "mysql"
})

module.exports = sequelize