const faker = require('faker/locale/en');
const mysql = require('mysql');

const con = mysql.createConnection({
    host: "classmysql.engr.oregonstate.edu",
    user: "cs340_perkinsn",
    password: "JrBg7UFMC0NuEzbF",
    database: "cs340_perkinsn"
});

const sql = `INSERT INTO users(first_name, last_name, email, password, password_salt, role)
VALUES (
    ?, ?, ?, ?, ?, ?
)`

const first_name = faker.name.firstName();
const last_name = faker.name.lastName();
const domain = faker.company.companyName().replace(/[^A-Za-z0-9-]+/g,'') + '.com';
const email = `${first_name}.${last_name}@${domain}`.toLowerCase();

const params = [
    first_name,
    last_name,
    email,
    faker.internet.password(),
    faker.internet.password(),
    'user'
]

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});

con.query(sql, params, function (err, result) {
    if (err) throw err;
    console.log(result);
});

con.end();