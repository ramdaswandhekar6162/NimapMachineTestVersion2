const { where } = require("sequelize");
const { Product, Category } = require("../models");
const category = require("../models/category");
const product = require("../models/product");

exports.createProduct = async (req, res) => {
  const { name, categoryId } = req.body;

  try {
    const product = await Product.create({ name, categoryId });
    res.redireact("/products");
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.getPaginatedProducts = async (req, res) => {
  const { page = 1, pageSize = 10 } = req.query;
  const offset = (page - 1) * pageSize;

  try {
    const products = await Product.findAndCountAll({
      offset,
      limit: pageSize,
      include: [{ model: Category, as: "category" }],
    });

    const totalPages = Math.ceil(products.count / pageSize);

    res.render("products", {
      products: products.rows,
      page: parseInt(page),
      totalPages,
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// previous method

exports.getProducts = async (req, res) => {
  let { page = 1, pageSize = 10 } = req.query;
  page = parseInt(page);
  pageSize = parseInt(pageSize);

  const offset = (page - 1) * pageSize;

  try {
    const products = await Product.findAndCountAll({
      offset,
      limit: pageSize,
      include: [{ model: Category, as: "category" }],
    });
    const totalPages = Math.ceil(products.count / pageSize);
    let obj = {
      products: products.rows,
      pagination: {
        current: page,
        totalPages: totalPages,
      },
    };
    res.status(201).send(obj);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.getOneProduct = async (req, res) => {
  let { id } = req.query;
  id = parseInt(id);
  try {
    const data = await Product.findOne({
      where: {
        id,
      },
    });
    const category = await Category.findOne({
      where: {
        id: parseInt(data.categoryId),
      },
    });
    const obj = {
      product: data,
      category: category,
    };
    res.status(201).send(obj);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.addProducts = async (req, res) => {
  const { name, categoryId } = req.query;

  let category = parseInt(categoryId);
  try {
    await Product.create({ name, categoryId: category });
    res.status(201).send("successfully added");
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.editProduct = async (req, res) => {
  let { id } = req.query;
  productId = parseInt(id);

  try {
    const product = await Product.findOne({
      where: {
        id: productId,
      },
    });
    const categories = await Category.findAll();
    let obj = {
      product: product,
      categories: categories,
    };
    res.status(201).send(obj);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.updateProduct = async (req, res) => {
  const { productId, productName, categoryId } = req.query;
  let id = parseInt(productId);
  let category = parseInt(categoryId);
  try {
    let x = await Product.update(
      {
        name: productName,
        categoryId: category,
      },
      {
        where: {
          id,
        },
      }
    );
    res.status(201).send(x);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.deleteProduct = async (req, res) => {
  const { id } = req.query;
  let productId = parseInt(id);

  try {
    Product.destroy({
      where: {
        id: productId,
      },
    });
    res.status(201).send("product are deleted....");
  } catch (error) {
    res.status(500).send(error.message);
  }
};
