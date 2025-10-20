const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

require("dotenv").config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("Error:", error);
  }
};

// Define an async function to start the server
const startServer = async () => {
  await connectDB(); 

  // Routes
  app.use("/", require("./controllers/userController"));
  app.use("/search", require("./controllers/searchController"));
  app.use("/product", require("./controllers/productController"));
  app.use("/voucher", require("./controllers/voucherController"));
  app.use("/order", require("./controllers/orderController"));
  app.use("/review", require("./controllers/reviewController"));
  app.use("/feedback", require("./controllers/feedbackController"));
  app.use("/revenue", require("./controllers/revenueController"));

  app.use("/upload", require("./controllers/uploadController"));
  // Start the server
  const port = process.env.PORT || 3001;
  app.listen(port, () => console.log(`Server is running on port ${port}`));
};

startServer();
