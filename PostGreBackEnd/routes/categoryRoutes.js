const express = require("express");

const router = express.Router();

const categoryController = require("../controllers/categoryController");

router.post("/add", categoryController.createCategory);
router.get("/", categoryController.getAllCategories);
router.get("/category", categoryController.getCategory);
router.get("/update", categoryController.getUpdateCategory);
router.post("/update", categoryController.updateCategory);
router.post("/delete", categoryController.deleteCategory);

module.exports = router;
