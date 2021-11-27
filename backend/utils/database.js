const {Sequelize} = require("sequelize");
let dbName = 'vavjs-eshop',
    username = 'postgres',
    password = 'postgres',
    host = 'database';// '127.0.0.1'

let conStringPost = 'postgres://' + username + ':' + password + '@' + host + '/' + dbName;
console.log(conStringPost);

let sequelize = new Sequelize(conStringPost);
sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.')
}).catch((error) => {
    console.error('Unable to connect to the database:', error);
});

module.exports = sequelize;