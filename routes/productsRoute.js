const express = require("express");
const router = express.Router();
const middleware = require("../middleware/auth");
const adminController = require("../controller/admin/index");
const displayController = require("../controller/display/index");

// Get all products
router.get("/", (req, res) => {
  return displayController.getProducts(req, res);
});

// Get single product
router.get("/:id", (req, res) => {
  return displayController.SingleProduct(req, res);
});

//Add a product
router.post("/",  (req, res) => {
  return adminController.addProduct(req, res);
});

//Edit product
router.patch("/:id", middleware, (req, res) => {
  return adminController.editProduct(req, res);
});

// Delete product
router.delete("/:id", middleware, (req, res) => {
  return adminController.deleteProduct(req, res);
});
module.exports = router;
