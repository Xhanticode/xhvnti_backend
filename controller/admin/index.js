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
    colour,
    description,
    qty,
    collection} = req.body;
  try {
    con.query(
      `INSERT INTO products (
        title,
        img,
        price,
        colour,
        description,
        qty,
        collection) VALUES ( "${title}", "${img}", "${price}", "${colour}", "${description}", "${qty}", "${collection}" )`,
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
  

// Edit product
async function editProduct(req, res) {
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
            res.send(updated);
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

async function deleteProduct(req, res) {
    try {
      let product = { id: req.params.id };
      let sql = `DELETE FROM products WHERE product_id = "${req.params.id}"`;
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
