// backend/app.js

const express = require("express");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const ErrorHandler = require("./middleware/error");

const app = express();
//heyy
// Middleware
app.use(express.json());
app.use(cookieParser());

// Configure CORS to allow requests from React frontend
const allowedOrigins = [
  "https://kalvium-follow-along.vercel.app",
  "http://localhost:5173"
];


app.use(cors({
  origin: allowedOrigins, // Update this if your frontend is hosted elsewhere
  credentials: true, // Enable if you need to send cookies or authentication headers
}));

app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
 
// Serve static files for uploads and products
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/products', express.static(path.join(__dirname, 'products')));
app.get("/",(req,res)=>{
  res.send("server working")
})
// Import Routes
const userRoutes = require("./controller/user");
const productRoutes = require('./controller/product');
const orders = require('./controller/orders');

// Route Handling
app.use("/api/v2/user", userRoutes);
app.use("/api/v2/product", productRoutes);
app.use("/api/v2/orders", orders);

// Error Handling Middleware
app.use(ErrorHandler);

module.exports = app;
