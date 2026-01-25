"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const express_2 = require("@clerk/express");
const router = (0, express_1.Router)();
router.post("/sync", (0, express_2.requireAuth)(), userController_1.syncUser);
exports.default = router;
