const { where } = require("sequelize");
const { Category, Product } = require("../models");

exports.createCategory = async (req, res) => {
  const { name } = req.query;

  try {
    await Category.create({ name });
    res.status(201).send("category addded ");
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.getCategory = async (req, res) => {
  let { id } = req.query;
  id = parseInt(id);
  try {
    let data = await Category.findOne({
      where: {
        id,
      },
    });
    res.status(201).send(data);
  } catch (error) {}
};

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.send(categories);
    //res.render("categories", { categories });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// exports.addCategory = async (req, res) => {
//   const { name } = req.body;
//   try {
//     await Category.create({
//       name,
//     });
//     res.status(201).send("category addded ");
//   } catch (error) {}
// };

exports.updateCategory = async (req, res) => {
  let { id } = req.query;
  const { name } = req.query;

  id = parseInt(id);

  try {
    await Category.update(
      {
        name,
      },
      {
        where: {
          id,
        },
      }
    );
    res.status(201).send("successfull");
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.getUpdateCategory = async (req, res) => {
  let { id } = req.query;
  id = parseInt(id);
  try {
    const category = await Category.findOne({
      where: {
        id,
      },
    });

    res.status(201).send(category);
  } catch (error) {
    res.status(500).send("Error update category .." + error.message);
  }
};

exports.deleteCategory = async (req, res) => {
  let { id } = req.query;
  id = parseInt(id);

  try {
    await Product.destroy({
      where: {
        categoryId: id,
      },
    });

    await Category.destroy({
      where: {
        id,
      },
    });

    res.status(201).send("deleted successfull");
  } catch (error) {
    res.status(500).send(error.message);
  }
};
