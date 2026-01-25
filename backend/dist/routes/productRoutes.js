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
const express_1 = require("express");
const productController = __importStar(require("../controllers/productController"));
const express_2 = require("@clerk/express");
const router = (0, express_1.Router)();
// GET /api/products => Get all products(public)
router.get("/", productController.getAllProducts);
// GET /api/products/my => Get current user products(not public)
router.get("/my", (0, express_2.requireAuth)(), productController.getMyProducts);
// GET /api/products/:id => Get single product by id (public)
router.get("/:id", productController.getProductById);
//POST /api/products - create new prodct(protected)
router.post("/", (0, express_2.requireAuth)(), productController.createProduct);
//PUT /api/products/:id = Update the product(protected)
router.put("/:id", (0, express_2.requireAuth)(), productController.updateProduct);
//DELETE /api/products/:id =Delete the product(protected)
router.delete("/:id", (0, express_2.requireAuth)(), productController.deleteProduct);
exports.default = router;
