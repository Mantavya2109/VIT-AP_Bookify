"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProductById = exports.getMyProducts = exports.getAllProducts = void 0;
const queries = __importStar(require("../db/queries"));
const express_1 = require("@clerk/express");
// Get all products (public), people can see without logging in also.
const getAllProducts = async (req, res) => {
    try {
        const products = await queries.getAllProducts();
        res.status(200).json(products);
    }
    catch (error) {
        console.error("Error getting products:", error);
        res.status(500).json({ error: "Failed to get products" });
    }
};
exports.getAllProducts = getAllProducts;
// get products by current user(protected)
const getMyProducts = async (req, res) => {
    try {
        const { userId } = (0, express_1.getAuth)(req);
        if (!userId)
            return res.status(401).json({ error: "Unauthorized" });
        const products = await queries.getProductsByUserId(userId);
        res.status(200).json(products);
    }
    catch (error) {
        console.error("Error getting products:", error);
        res.status(500).json({ error: "Failed to get products" });
    }
};
exports.getMyProducts = getMyProducts;
//get single product by id (public)
const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await queries.getProductById(id);
        if (!product)
            return res.status(404).json({ error: "Product not found" });
        res.status(200).json(product);
    }
    catch (error) {
        console.error("Error getting product:", error);
        res.status(500).json({ error: "Failed to get product" });
    }
};
exports.getProductById = getProductById;
//create a producted (protected)
const createProduct = async (req, res) => {
    try {
        const { userId } = (0, express_1.getAuth)(req);
        if (!userId)
            return res.status(401).json({ error: "Unauthorized" });
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
    }
    catch (error) {
        console.error("Error in creating product:", error);
        res.status(500).json({ error: "Failed to create product" });
    }
};
exports.createProduct = createProduct;
// Update product(protected)
const updateProduct = async (req, res) => {
    try {
        const { userId } = (0, express_1.getAuth)(req);
        if (!userId)
            return res.status(401).json({ error: "Unauthorized" });
        const { id } = req.params;
        const { title, description, imageUrl } = req.body;
        const existingProduct = await queries.getProductById(id);
        if (!existingProduct) {
            res.status(404).json({ error: "Product not found" });
            return;
        }
        if (existingProduct.userId !== userId) {
            res.status(403).json({ error: "You can update your own products only" });
            return;
        }
        const product = await queries.updateProduct(id, {
            title,
            description,
            imageUrl,
        });
        res.status(200).json(product);
    }
    catch (error) {
        console.error("Error updating product", error);
        res.status(500).json({ error: "Failed to update product" });
    }
};
exports.updateProduct = updateProduct;
// Delete a product(protected)
const deleteProduct = async (req, res) => {
    try {
        const { userId } = (0, express_1.getAuth)(req);
        if (!userId)
            return res.status(401).json({ error: "Unauthorized" });
        const { id } = req.params;
        const existingProduct = await queries.getProductById(id);
        if (!existingProduct) {
            res.status(404).json({ error: "Product not found" });
            return;
        }
        if (existingProduct.userId !== userId) {
            res.status(403).json({ error: "You can delete your own products only" });
            return;
        }
        await queries.deleteProduct(id);
        res.status(200).json({ message: "Product deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ error: "Failed to delete product" });
    }
};
exports.deleteProduct = deleteProduct;
