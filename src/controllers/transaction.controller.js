
import { connectDB } from "../config/db.js";
import { ObjectId } from "mongodb";

export const createTransaction = async (req, res) => {
  try {
    const { title, amount, type, category, date } = req.body;

    // Validate required fields
    if (!title || !amount || !type || !category || !date) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    const numericAmount = Number(amount);

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount must be a positive number.",
      });
    }

    if (!["income", "expense"].includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Transaction type must be income or expense.",
      });
    }

    const transactionDate = new Date(date);

    if (Number.isNaN(transactionDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid transaction date.",
      });
    }

    const db = await connectDB();

    const transaction = {
      userId: req.user.id,
      title: title.trim(),
      amount: numericAmount,
      type,
      category: category.trim(),
      date: transactionDate,
      createdAt: new Date(),
    };

    const result = await db
      .collection("transactions")
      .insertOne(transaction);

    return res.status(201).json({
      success: true,
      message: "Transaction created successfully.",
      data: {
        ...transaction,
        _id: result.insertedId,
      },
    });
  } catch (error) {
    console.error("Create transaction error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create transaction.",
    });
  }
};


export const getAllTransactions = async (req, res) => {
  try {
    const db = await connectDB();
    const userId = req.user.id;

    const transactions = await db
      .collection("transactions")
      .find({ userId })
      .sort({ date: -1, createdAt: -1 })
      .toArray();

    return res.status(200).json({
      success: true,
      data: transactions,
    });
  } catch (error) {
    console.error("Get transactions error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch transactions.",
    });
  }
};



export const getTransactionById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid transaction ID.",
      });
    }

    const db = await connectDB();

    const transaction = await db.collection("transactions").findOne({
      _id: new ObjectId(id),
      userId: req.user.id,
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: transaction,
    });
  } catch (error) {
    console.error("Get transaction error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch transaction.",
    });
  }
};



export const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, amount, type, category, date } = req.body;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid transaction ID.",
      });
    }

    if (!title || !amount || !type || !category || !date) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    const numericAmount = Number(amount);
    const transactionDate = new Date(date);

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount must be a positive number.",
      });
    }

    if (!["income", "expense"].includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Invalid transaction type.",
      });
    }

    if (!Number.isFinite(transactionDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid transaction date.",
      });
    }

    const db = await connectDB();

    const result = await db.collection("transactions").updateOne(
      {
        _id: new ObjectId(id),
        userId: req.user.id,
      },
      {
        $set: {
          title: title.trim(),
          amount: numericAmount,
          type,
          category: category.trim(),
          date: transactionDate,
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Transaction updated successfully.",
    });
  } catch (error) {
    console.error("Update transaction error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update transaction.",
    });
  }
};


export const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid transaction ID.",
      });
    }

    const db = await connectDB();

    const result = await db.collection("transactions").deleteOne({
      _id: new ObjectId(id),
      userId: req.user.id,
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Transaction deleted successfully.",
    });
  } catch (error) {
    console.error("Delete transaction error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete transaction.",
    });
  }
};