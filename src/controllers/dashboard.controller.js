import { connectDB } from "../config/db.js";

export const getDashboardSummary = async (req, res) => {
  try {
    const db = await connectDB();

    // Only the authenticated user's transactions
    const userId = req.user.id;

    const transactions = db.collection("transactions");

    const summary = await transactions
      .aggregate([
        {
          $match: { userId },
        },
        {
          $group: {
            _id: null,
            totalIncome: {
              $sum: {
                $cond: [
                  { $eq: ["$type", "income"] },
                  "$amount",
                  0,
                ],
              },
            },
            totalExpenses: {
              $sum: {
                $cond: [
                  { $eq: ["$type", "expense"] },
                  "$amount",
                  0,
                ],
              },
            },
          },
        },
      ])
      .toArray();

    const totals = summary[0] || {
      totalIncome: 0,
      totalExpenses: 0,
    };

    const recentTransactions = await transactions
      .find({ userId })
      .sort({ date: -1, createdAt: -1 })
      .limit(5)
      .toArray();

    const totalBalance = totals.totalIncome - totals.totalExpenses;

    return res.status(200).json({
      success: true,
      data: {
        totalIncome: totals.totalIncome,
        totalExpenses: totals.totalExpenses,
        totalBalance,
        recentTransactions,
      },
    });
  } catch (error) {
    console.error("Dashboard summary error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard summary.",
    });
  }
};