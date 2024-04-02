const mysql = require("mysql");
const dotenv = require("dotenv").config();

const bdd = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "testpfe",
  port: 3307,
});

bdd.connect((err) => {
  if (err) {
    console.log(err.message);
  }
  console.log("connexion a la base de donne : " + bdd.state);
});

module.exports = bdd;
