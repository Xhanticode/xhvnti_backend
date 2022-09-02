const bcrypt = require("bcryptjs");
const con = require("../../lib/db_connection");
const jwt = require("jsonwebtoken");
require("dotenv").config();


// Add product
async function addProduct(req, res) {
  const {
    title,
    img,
    price,
    color,
    description,
    qty,
    collection,
    user_id,
  } = req.body;
  try {
    con.query(
      
      `INSERT INTO products (
        title,
        img,
        price,
        color,
        description,
        qty,
        collection,
        user_id) VALUES ( "${title}", ${img}", "${price}", ${color}", "${description}", "${qty}", "${collection}", ${price}", "${user_id}" )`,
      (err, result) => {
        if (err) throw err;
        res.send("product successfully created");
      }
    );
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }}
  

// Edit product
async function editProduct(req, res) {
  if (req.user.userRole === "admin" || req.user.userRole === "user") {
    try {
      let sql = "SELECT * FROM products WHERE ? ";
      let product = { id: req.params.id };
      con.query(sql, product, (err, result) => {
        if (err) throw err;
        if (result.length !== 0) {
          let updateSql = `UPDATE products SET ? WHERE id = ${req.params.id}`;
          let updateProduct = {
            title: req.body.title,
            img: req.body.img,
            price: req.body.price,
            color: req.body.color,
            description: req.body.description,
            qty: req.body.qty,
            collection: req.body.collection,
          };
          con.query(updateSql, updateProduct, (err, updated) => {
            if (err) throw err;
            res.send("Successfully updated Product");
          });
        } else {
          res.send("Product not found");
        }
      });
    } catch (error) {
      console.log(error);
    }
  }
}

async function deleteProduct(req, res) {
  if (req.user.userRole === "admin")
    try {
      let sql = "Delete from products WHERE ?";
      let product = { id: req.params.id };
      con.query(sql, product, (err, result) => {
        if (err) throw err;
        res.send(result);
      });
    } catch (error) {
      console.log(error);
    }
}
module.exports = {
  addProduct,
  editProduct,
  deleteProduct,
};
