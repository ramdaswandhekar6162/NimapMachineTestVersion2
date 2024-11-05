const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

router.post("/add1", productController.createProduct);
router.get("/b", productController.getPaginatedProducts);

router.get("/", productController.getProducts);
router.get("/product", productController.getOneProduct);
router.post("/add", productController.addProducts);
router.get("/edit", productController.editProduct);
router.post("/edit", productController.updateProduct);
router.post("/delete", productController.deleteProduct);

module.exports = router;
