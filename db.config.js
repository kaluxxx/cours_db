module.exports = {
    HOST: "localhost",
    USER: "root",
    PASSWORD: "test",
    DB: "cours_b3",
    dialect: "mysql",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};