import { Router } from "express";
import * as productController from "../controllers/productController";
import { requireAuth } from "@clerk/express";

const router = Router();

// GET /api/products => Get all products(public)
router.get("/", productController.getAllProducts);

// GET /api/products/my => Get current user products(not public)
router.get("/my", requireAuth(), productController.getMyProducts);

// GET /api/products/:id => Get single product by id (public)
router.get("/:id", productController.getProductById);

//POST /api/products - create new prodct(protected)
router.post("/", requireAuth(), productController.createProduct);

//PUT /api/products/:id = Update the product(protected)
router.put("/:id", requireAuth(), productController.updateProduct);

//DELETE /api/products/:id =Delete the product(protected)
router.delete("/:id", requireAuth(), productController.deleteProduct);

export default router;
