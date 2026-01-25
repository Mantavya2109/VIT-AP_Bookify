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
exports.syncUser = syncUser;
const queries = __importStar(require("../db/queries"));
const express_1 = require("@clerk/express");
async function syncUser(req, res) {
    try {
        const { userId } = (0, express_1.getAuth)(req);
        if (!userId)
            return res.status(401).json({ error: "Unauthorized" });
        const { email, name, imageUrl } = req.body;
        if (!email || !name || !imageUrl) {
            return res
                .status(400)
                .json({ error: "Email, name, and imageUrl are required" });
        }
        const user = await queries.upsertUser({
            id: userId,
            email,
            name,
            imageUrl,
        });
        res.status(200).json(user);
    }
    catch (error) {
        console.error("Error syncing user:", error instanceof Error ? error.message : "Unknown error");
        res.status(500).json({ error: "Failed to sync user" });
    }
}
