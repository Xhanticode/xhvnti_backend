"use strict";

var express = require("express");

var router = express.Router();

var middleware = require("../middleware/auth");

var authController = require("../controller/auth/index");

var passController = require("../controller/password/index");

var displayController = require("../controller/display/index");

var userController = require("../controller/user/index"); // Get employees


router.get("/", function (req, res) {
  return displayController.getEmployees(req, res);
}); //Add an employee

router.post("/", function (req, res) {
  return userController.addEmployee(req, res);
}); // Get single employee

router.get("/:id", function (req, res) {
  return displayController.getSingleEmployee(req, res);
}); //Edit an employee

router.put("/:id", function (req, res) {
  return userController.editEmployee(req, res);
}); // Delete an employee

router["delete"]("/:id", middleware, function (req, res) {
  return userController.deleteEmployee(req, res);
}); // Register

router.post("/register", function (req, res) {
  return authController.employeeRegister(req, res);
}); // Login

router.post("/login", function (req, res) {
  console.log(req.body);
  return authController.employeeLogin(req, res);
}); // Verify

router.get("/employees/verify", function (req, res) {
  return authController.Verify(req, res);
}); // Forgot password

router.post("/forgot_employee_psw", function (req, res) {
  return passController.forgotEmployeePsw(req, res);
}); // Reset Password

router.put("/reset_employee_psw/:id", function (req, res) {
  return passController.resetEmployeePsw(req, res);
});
router.patch("/:id", function (req, res) {
  return userController.editUser(req, res);
});
module.exports = router;