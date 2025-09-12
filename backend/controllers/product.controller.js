import { sql } from "../config/db.js";

export const getAllProducts = async (req, res) => {
  try {
    const products = await sql`
      SELECT * FROM products
      ORDER BY created_at DESC
    `;
    res.status(200).json({ success: true, data: products });
  } catch (e) {
    console.log(`Error in getAllProducts: ${e.message}`);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const products = await sql`SELECT * FROM products WHERE id = ${id}`;

    if (products.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, data: products[0] });
  } catch (e) {
    console.log(`Error in getProduct: ${e.message}`);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, image, price } = req.body;

    if (!name || !image || !price) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, image and price",
      });
    }

    const products =
      await sql`INSERT INTO products (name, image, price) VALUES (${name}, ${image}, ${price}) RETURNING *`;

    res.status(200).json({ success: true, data: products[0] });
  } catch (e) {
    console.log(`Error in createProduct: ${e.message}`);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, image, price } = req.body;

    const products =
      await sql`UPDATE products SET name = ${name}, image = ${image}, price = ${price} WHERE id = ${id} RETURNING *`;

    if (products.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, data: products[0] });
  } catch (e) {
    console.log(`Error in updateProduct: ${e.message}`);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const products =
      await sql`DELETE FROM products WHERE id = ${id} RETURNING *`;

    if (products.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, data: products[0] });
  } catch (e) {
    console.log(`Error in deleteProduct: ${e.message}`);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
