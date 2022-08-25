const express = require("express");
const router = express.Router();
const middleware = require("../middleware/auth");
const authController = require("../controller/auth/index");
const passController = require("../controller/password/index");
const displayController = require("../controller/display/index");
const userController = require("../controller/user/index");

// Get employees
router.get("/", (req, res) => {
  return displayController.getEmployees(req, res);
});

//Add an employee
router.post("/", (req, res) => {
  return userController.addEmployee(req, res);
});

// Get single employee
router.get("/:id", (req, res) => {
  return displayController.getSingleEmployee(req, res);
});

//Edit an employee
router.put("/:id", (req, res) => {
  return userController.editEmployee(req, res);
});

// DELETE A USER
router.delete("/:id", middleware, (req, res) => {
  return userController.deleteEmployee(req, res);
});

// Register
router.post("/register", (req, res) => {
  return authController.Register(req, res);
});

// Login
router.post("/login", (req, res) => {
  console.log(req.body);
  return authController.Login(req, res);
});

// Verify
router.get("/employees/verify", (req, res) => {
  return authController.Verify(req, res);
});

// FORGOT PASSWORD
router.post("/forgot-psw", (req, res) => {
  return passController.forgotPsw(req, res);
});

// Rest Password Route

router.put("/reset-psw/:id", (req, res) => {
  return passController.resetPsw(req, res);
});

// cart
// VIEW CART
router.get("/:id/cart", (req, res) => {
  return userController.getCartItems(req, res);
});

router.patch("/:id", (req, res) => {
  return userController.editUser(req, res);
});

router.delete(":/id/cart", (req, res) => {
  return userController.deleteCartItem(req, res);
});

router.patch(":/id/cart/_id", (req, res) => {
  return userController.clearCartItems(req, res);
});
router.put(":/id/cart", (req, res) => {
  return userController.editCart(req, res);
});

module.exports = router;
