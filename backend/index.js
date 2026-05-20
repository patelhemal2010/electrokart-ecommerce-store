// packages
import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

// Utils
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import chatbotRoutes from "./routes/chatbotRoutes.js";
import visualSearchRoutes from "./routes/visualSearchRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

dotenv.config();
const port = process.env.PORT || 5000;
const rootDir = path.resolve();

connectDB();

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
];
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// ✅ Allow JSON + Base64 (for avatar uploads)
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/visual-search", visualSearchRoutes);
app.use("/api/payment", paymentRoutes);

app.get("/api/config/paypal", (req, res) => {
  res.send({ clientId: process.env.PAYPAL_CLIENT_ID });
});

app.use("/uploads", express.static(path.join(rootDir, "uploads")));

if (process.env.NODE_ENV === "production") {
  const frontendDist = path.join(rootDir, "frontend", "dist");
  app.use(express.static(frontendDist));
  app.get("*", (req, res, next) => {
    if (
      req.path.startsWith("/api") ||
      req.path.startsWith("/uploads")
    ) {
      return next();
    }
    res.sendFile(path.join(frontendDist, "index.html"));
  });
}

app.use((req, res, next) => {
  if (req.originalUrl.startsWith("/api")) {
    res.status(404).json({ message: "API route not found" });
  } else {
    next();
  }
});

// ✅ Global error handler (good practice)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(res.statusCode || 500).json({
    message: err.message || "Something went wrong",
  });
});

app.listen(port, () =>
  console.log(`✅ Server running in ${process.env.NODE_ENV} mode on port ${port}`)
);
