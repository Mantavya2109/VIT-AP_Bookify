import type { Request, Response } from "express";
import * as queries from "../db/queries";
import { getAuth } from "@clerk/express";

// Get all products (public), people can see without logging in also.
export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await queries.getAllProducts();
    res.status(200).json(products);
  } catch (error) {
    console.error("Error getting products:", error);
    res.status(500).json({ error: "Failed to get products" });
  }
};

// get products by current user(protected)
export const getMyProducts = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const products = await queries.getProductsByUserId(userId);
    res.status(200).json(products);
  } catch (error) {
    console.error("Error getting products:", error);
    res.status(500).json({ error: "Failed to get products" });
  }
};
//get single product by id (public)
export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await queries.getProductById(id as string);

    if (!product) return res.status(404).json({ error: "Product not found" });

    res.status(200).json(product);
  } catch (error) {
    console.error("Error getting product:", error);
    res.status(500).json({ error: "Failed to get product" });
  }
};

//create a producted (protected)
export const createProduct = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const { title, description, imageUrl } = req.body;

    if (!title || !description || !imageUrl) {
      res
        .status(400)
        .json({ error: "Title, description and imageUrl are required" });
      return;
    }
    const product = await queries.createProduct({
      title,
      description,
      imageUrl,
      userId,
    });
    res.status(201).json(product);
  } catch (error) {
    console.error("Error in creating product:", error);
    res.status(500).json({ error: "Failed to create product" });
  }
};

// Update product(protected)
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const { id } = req.params;
    const { title, description, imageUrl } = req.body;

    const existingProduct = await queries.getProductById(id as string);
    if (!existingProduct) {
      res.status(404).json({ error: "Product not found" });
      return;
    }
    if (existingProduct.userId !== userId) {
      res.status(403).json({ error: "You can update your own products only" });
      return;
    }

    const product = await queries.updateProduct(id as string, {
      title,
      description,
      imageUrl,
    });
    res.status(200).json(product);
  } catch (error) {
    console.error("Error updating product", error);
    res.status(500).json({ error: "Failed to update product" });
  }
};

// Delete a product(protected)
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const { id } = req.params;

    const existingProduct = await queries.getProductById(id as string);
    if (!existingProduct) {
      res.status(404).json({ error: "Product not found" });
      return;
    }
    if (existingProduct.userId !== userId) {
      res.status(403).json({ error: "You can delete your own products only" });
      return;
    }

    await queries.deleteProduct(id as string);
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Failed to delete product" });
  }
};
