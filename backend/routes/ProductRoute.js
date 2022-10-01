const express = require("express");
const {
  getAllProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getSingleProduct,
} = require("../controller/ProductController"); 

const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router.route("/products").get(getAllProduct);
router.route("/product/new").post(isAuthenticatedUser,authorizeRoles('admin'),createProduct);
router.route("/product/:id").put(isAuthenticatedUser,authorizeRoles('admin'),updateProduct);
router.route("/product/:id").delete(isAuthenticatedUser,authorizeRoles('admin'),deleteProduct);
router.route("/product/:id").get(getSingleProduct); 

module.exports = router;
