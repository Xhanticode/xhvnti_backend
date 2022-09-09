const con = require("../../lib/db_connection");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const bodyParser = require("body-parser");
const express = require("express");
const router = express.Router();
const middleware = require("../../middleware/auth");

// Add user
async function addUser(req, res) {
  const { name, surname, email, phone, password, shipping_address, cart } =
    req.body;
  try {
    con.query(
      `INSERT INTO users (
        name, 
        surname,
        email,
        phone,
        password,
        shipping_address,
        cart) values ("${name}","${surname}","${email}","${phone}","${password}","${shipping_address}","${cart}")`,
      (err, result) => {
        if (err) throw err;
        res.send(result);
      }
    );
  } catch (error) {
    console.log(error);
  }
}
// Edit user
async function editUser(req, res) {
  const { name, surname, email, phone, password, shipping_address, cart } =
    req.body;
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  try {
    con.query(
      `UPDATE users SET name="${name}",surname="${surname}", email="${email}", phone="${phone}", password="${hash}", shipping_address="${shipping_address}", cart="${cart}" WHERE user_id="${req.params.id}"`,
      (err, result) => {
        if (err) throw err;
        res.send(result);
      }
    );
  } catch (error) {
    console.log(error);
  }
}

//Delete user
async function deleteUser(req, res) {
  try {
    con.query(
      `DELETE FROM users WHERE user_id="${req.params.id}"`,
      (err, result) => {
        if (err) throw err;
        res.send(result);
        console.log("User succesfully deleted!")
      }
    );
  } catch (error) {
    console.log(error);
  }
}

// Get cart items
async function getCartItems (req, res) {
  try {
    const strQuery = "SELECT cart FROM users WHERE user_id = ?";
    con.query(strQuery, [req.params.id], (err, results) => {
      if (err) throw err;
      (function Check(a, b) {
        a = parseInt(req.user.user_id);
        b = parseInt(req.params.id);
        if (a === b) {
          //   res.send(results[0].cart);
          //   console.log(results[0]);
          res.json(JSON.parse(results[0].cart));
        } else {
          res.json({
            a,
            b,
            msg: "Please Login To View cart",
          });
        }
      })();
    });
  } catch (error) {
    throw error;
  }
}

// add cart items
async function addCartItem (req, res) {
  try {
    let { product_id } = req.body;
    const qcart = `SELECT cart
      FROM users
      WHERE user_id = ?;
      `;
    con.query(qcart, req.user.user_id, (err, results) => {
      if (err) throw err;
      let cart;
      if (results.length > 0) {
        if (results[0].cart === null) {
          cart = [];
        } else {
          cart = JSON.parse(results[0].cart);
        }
      }
      const strProd = `
      SELECT *
      FROM products
      WHERE product_id = ${product_id};
      `;
      con.query(strProd, async (err, results) => {
        if (err) throw err;
        let product = {
          cart_id: cart.length + 1,
          product_id: results[0].product_id,
          title: results[0].title,
          price: results[0].price,
          qty: results[0].price,
          description: results[0].description,
          colour: results[0].colour,
          img: results[0].img,
          collection: results[0].collection,
        };
        cart.push(product);
        // res.send(cart)
        const strQuery = `UPDATE users
      SET cart = ?
      WHERE (user_id = ${req.user.user_id})`;
        con.query(strQuery, /*req.user.id */ JSON.stringify(cart), (err) => {
          if (err) throw err;
          res.json({
            results,
            msg: "Product added to cart",
          });
        });
      });
    });
  } catch (error) {
    console.log(error.message);
  }
}

// delete one item from cart
async function deleteCartItem (req, res) {
  const dcart = `SELECT cart
    FROM users
    WHERE user_id = ?`;
  con.query(dcart, req.user.user_id, (err, results) => {
    if (err) throw err;
    let item = JSON.parse(results[0].cart).filter((x) => {
      return x.cart_id != req.params.product_id;
    });
    // res.send(item)
    const strQry = `
    UPDATE users
    SET cart = ?
    WHERE user_id= ? ;
    `;
    con.query(
      strQry,
      [JSON.stringify(item), req.user.user_id],
      (err, data, fields) => {
        if (err) throw err;
        res.json({
          msg: "Item Removed from cart",
        });
      }
    );
  });
}

// delete all cart items
async function clearCart (req, res) {
  const dcart = `SELECT cart
    FROM users
    WHERE user_id = ?`;
  con.query(dcart, req.user.user_id, (err, results) => {
    // let cart =
  });
  const strQry = `
    UPDATE users
      SET cart = null
      WHERE (user_id = ?);
      `;
  con.query(strQry, [req.user.user_id], (err, data, fields) => {
    if (err) throw err;
    res.json({
      msg: "Item Deleted",
    });
  });
}


module.exports = {
  editUser,
  deleteUser,
  addUser,
  getCartItems,
  addCartItem,
  deleteCartItem,
  clearCart,
};
