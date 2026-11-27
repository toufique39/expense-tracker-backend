
import express from "express";
import { createTransaction, deleteTransaction, getAllTransactions, getTransactionById, updateTransaction } from "../controllers/transaction.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", requireAuth, createTransaction);
router.get("/", requireAuth, getAllTransactions);
router.get("/:id", requireAuth, getTransactionById);
router.put("/:id", requireAuth, updateTransaction);
router.delete("/:id", requireAuth, deleteTransaction);

export default router;
