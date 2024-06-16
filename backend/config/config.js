const {Sequelize} = require('sequelize')

const data = {
    dbName: 'widatech_submission_2',
    dbUsername: 'root',
    dbPassword: 'root',
    dbHost: 'localhost'
}

const sequelize = new Sequelize(data.dbName, data.dbUsername, data.dbPassword, {
    host: data.dbHost,
    dialect: "mysql"
})

module.exports = sequelize