const express = require("express");
const router = express.Router();
const middleware = require("../middleware/auth");
const authController = require("../controller/auth/index");
const passController = require("../controller/password/index");
const displayController = require("../controller/display/index");
const userController = require("../controller/user/index");
const bodyParser = require("body-parser");

// Get users
router.get("/", (req, res) => {
  return displayController.getUsers(req, res);
});

//Add user
router.post("/", (req, res) => {
  return userController.addUser(req, res);
});

// Get single user
router.get("/:id", (req, res) => {
  return displayController.getSingleUser(req, res);
});

//Update user
router.patch("/update/:id", (req, res) => {
  return authController.updateUser(req, res);
});

// Delete user
router.delete("/delete/:id", (req, res) => {
  return userController.deleteUser(req, res);
});

// Register
router.post("/register", (req, res) => {
  return authController.userRegister(req, res);
});

// Login
router.post("/login", (req, res) => {
  console.log(req.body);
  return authController.userLogin(req, res);
});

// Verify
router.get("/users/verify", (req, res) => {
  return authController.Verify(req, res);
});

// Forgot password
router.post("/forgot_user_psw", (req, res) => {
  return passController.forgotUserPsw(req, res);
});

// Reset Password

router.put("/reset_user_psw/:id", (req, res) => {
  return passController.resetUserPsw(req, res);
});

// Cart

// Add item
router.post("/users/:id/cart", middleware, bodyParser.json(), (req, res) => {
    return userController.addCartItem(req, res);
});
// Delete item
router.delete("/users/:id/cart/:product_id", middleware, (req, res) => {
    return userController.deleteCartItem(req, res);
});
// View Cart
router.get("/users/:id/cart", middleware, (req, res) => {
  return userController.getCartItems(req, res);
});
// Clear all
router.delete("/users/:id/cart", middleware, (req, res) => {
  return userController.clearCart(req, res);
});

module.exports = router;