const con = require("../../lib/db_connection");
const bcrypt = require("bcryptjs");
require("dotenv").config();

// Add user
async function addUser(req, res) {
  const { name, surname, email, phone, password, shipping_address, created_at, cart } =
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
        cart,
        created_at) values ("${name}","${surname}","${email}","${phone}","${password}","${shipping_address}","${cart}","${created_at}")`,
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
  const { name, surname, email, phone, password, shipping_address, cart, created_at, } =
    req.body;
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  try {
    con.query(
      `UPDATE users SET name="${name}",surname="${surname}", email="${email}", phone="${phone}", password="${hash}", shipping_address="${shipping_address}", cart="${cart}", created_at="${created_at}" WHERE id= ${req.params.id}`,
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
      `DELETE FROM users  WHERE user_id="${req.params.id}"`,
      (err, result) => {
        if (err) throw err;
        res.send(result);
      }
    );
  } catch (error) {
    console.log(error);
  }
}

// Add cart item
async function addCartItem(req, res) {
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
          cartid: cart.length + 1,
          id: results[0].id,
          title: results[0].title,
          price: results[0].price,
          description: results[0].description,
          img: results[0].img,
          collection: results[0].collection,
          created_at: results[0].created_at,
        };

        cart.push(product);
        // res.send(cart)
        const strQuery = `UPDATE users
      SET cart = ?
      WHERE (user_id = ${req.user.user_id})`;
        con.query(strQuery, JSON.stringify(cart), (err) => {
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

// Delete cart item

async function deleteCartItem(req, res) {
  const dcart = `SELECT cart
    FROM users
    WHERE user_id = ?`;
  con.query(dcart, req.user.user_id, (err, results) => {
    if (err) throw err;
    let item = JSON.parse(results[0].cart).filter((x) => {
      return x.cartid != req.params.product_id;
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

// Get all cart items
async function getCartItems(req, res) {
  try {
    const strQuery = "SELECT cart FROM users WHERE user_id = ?";
    con.query(strQuery, [req.user.user_id], (err, results) => {
      if (err) throw err;
      (function Check(a, b) {
        a = parseInt(req.user.user_id);
        b = parseInt(req.params.id);
        if (a === b) {
          //   res.send(results[0].cart);
          console.log(results[0]);
          res.json(results[0].cart);
        } else {
          res.json({
            a,
            b,
            msg: "Please login To view cart",
          });
        }
      })();
    });
  } catch (error) {
    throw error;
  }
}

// Clear cart
async function clearCart(req, res) {
  const dcart = `SELECT cart 
    FROM users
    WHERE id = ?`;

  con.query(dcart, req.user.user_id, (err, results) => {
    // let cart =
  });
  const strQry = `
    UPDATE users
      SET cart = null
      WHERE (id = ?);
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
