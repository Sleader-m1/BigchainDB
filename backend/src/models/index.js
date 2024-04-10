const dbConfig = require("../configs/dbConfig");
const studentModel = require("./studentModel");

const {Sequelize, DataTypes} = require("sequelize");

const sequelize = new Sequelize(
    dbConfig.database,
    dbConfig.user,
    dbConfig.password, {
        host: dbConfig.host,
        dialect: dbConfig.dialect,
        pool: {
            max: dbConfig.pool.max,
            min: dbConfig.pool.min
        }
    }
)

const db = {
    sequelize: sequelize,
    students: studentModel(sequelize, DataTypes)
}

// force: false, Don't keep creating new database tables whenever restart the server.
sequelize.sync({force: false}).then(() => {
    console.log("re-sync done!")
})

module.exports = {db};