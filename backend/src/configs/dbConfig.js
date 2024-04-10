const dbConfig = {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    dialect: process.env.DIALECT,
    pool: {
        max: Number(process.env.MAX),
        min: Number(process.env.MIN),
    }
}

module.exports = dbConfig;