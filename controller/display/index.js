const con = require("../../lib/db_connection");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Get all employees
async function getEmployees(req, res) {
  try {
    let sql = "SELECT * FROM employees";
    con.query(sql, (err, result) => {
      if (err) throw err;
      res.send(result);
    });
  } catch (error) {
    console.log(error);
  }
}

// Get single employee
async function getSingleEmployee(req, res) {
  try {
    con.query(
      `SELECT * FROM employees where id= ${req.params.id} `,
      (err, result) => {
        if (err) throw err;
        res.send(result);
      }
    );
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
}

// Get all products
 function getProducts(req, res) {
  try {
    con.query("SELECT * FROM products",(err, result) => {
       if (err) throw err;
      res.send(result);
    });
  } catch (error) {
    console.log(error);
  }
}

// Get single product
async function SingleProduct(req, res) {
  try {
    con.query(
      `SELECT * FROM products where id = ${req.params.id} `,
      (err, result) => {
        if (err) throw err;
        res.send(result);
      }
    );
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
}

module.exports = {
  getEmployees,
  getSingleEmployee,
  getProducts,
  SingleProduct,
};
