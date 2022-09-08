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
  return employeeController.addEmployee(req, res);
});

// Get single employee
router.get("/:id", (req, res) => {
  return displayController.getSingleEmployee(req, res);
});

//Update an employee
router.patch("/update/:id", (req, res) => {
  return authController.updateEmployee(req, res);
});

// Delete an employee
router.delete("/:id", middleware, (req, res) => {
  return employeeController.deleteEmployee(req, res);
});

// Register
router.post("/register", (req, res) => {
  return authController.employeeRegister(req, res);
});

// Login
router.post("/login", (req, res) => {
  console.log(req.body);
  return authController.employeeLogin(req, res);
});

// Verify
router.get("/employees/verify", (req, res) => {
  return authController.Verify(req, res);
});

// Forgot password
router.post("/forgot_employee_psw", (req, res) => {
  return passController.forgotEmployeePsw(req, res);
});

// Reset Password
router.put("/reset_employee_psw/:id", (req, res) => {
  return passController.resetEmployeePsw(req, res);
});

// router.patch("/:id", (req, res) => {
//   return userController.editUser(req, res);
// });

module.exports = router;
