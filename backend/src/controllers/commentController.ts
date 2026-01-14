import type { Request, Response } from "express";
import * as queries from "../db/queries";
import { getAuth } from "@clerk/express";
import { ColumnAliasProxyHandler } from "drizzle-orm";
import { comments } from "../db/schema";

export const createComment = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const { productId } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ error: "Comment content is required" });
    }

    //verify product exists
    const product = await queries.getProductById(String(productId));
    if (!product) return res.status(404).json({ error: "Product not found" });

    const comment = await queries.createComment({
      content,
      userId,
      productId: String(productId),
    });
    res.status(201).json(comment);
  } catch (error) {
    console.error("Eroor creating comment", error);
    res.status(500).json({ error: "Failed to create comment" });
  }
};

export const deleteComment = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const { CommentId } = req.params;

    //Check if comment exists and belong to user
    const existingComment = await queries.getCommentById(String(CommentId));
    if (!existingComment)
      return res.status(404).json({ error: "Comment not found" });

    if (existingComment.userId !== userId) {
      return res
        .status(403)
        .json({ error: "You can only delete your own comments" });
    }

    await queries.deleteComment(String(CommentId));
    res.status(200).json({ error: "Comment deleted successfully" });
  } catch (error) {
    console.error("Eroor deleting comment", error);
    res.status(500).json({ error: "Failed to delete comment" });
  }
};
