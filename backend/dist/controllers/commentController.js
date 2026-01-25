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
exports.deleteComment = exports.createComment = void 0;
const queries = __importStar(require("../db/queries"));
const express_1 = require("@clerk/express");
const createComment = async (req, res) => {
    try {
        const { userId } = (0, express_1.getAuth)(req);
        if (!userId)
            return res.status(401).json({ error: "Unauthorized" });
        const { productId } = req.params;
        const { content } = req.body;
        if (!content) {
            return res.status(400).json({ error: "Comment content is required" });
        }
        //verify product exists
        const product = await queries.getProductById(String(productId));
        if (!product)
            return res.status(404).json({ error: "Product not found" });
        const comment = await queries.createComment({
            content,
            userId,
            productId: String(productId),
        });
        res.status(201).json(comment);
    }
    catch (error) {
        console.error("Error creating comment", error);
        res.status(500).json({ error: "Failed to create comment" });
    }
};
exports.createComment = createComment;
const deleteComment = async (req, res) => {
    try {
        const { userId } = (0, express_1.getAuth)(req);
        if (!userId)
            return res.status(401).json({ error: "Unauthorized" });
        const { commentId } = req.params;
        //Check if comment exists and belong to user
        const existingComment = await queries.getCommentById(String(commentId));
        if (!existingComment)
            return res.status(404).json({ error: "Comment not found" });
        if (existingComment.userId !== userId) {
            return res
                .status(403)
                .json({ error: "You can only delete your own comments" });
        }
        await queries.deleteComment(String(commentId));
        res.status(200).json({ message: "Comment deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting comment", error);
        res.status(500).json({ error: "Failed to delete comment" });
    }
};
exports.deleteComment = deleteComment;
