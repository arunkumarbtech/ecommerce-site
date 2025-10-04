import express, { json } from 'express';
import cors from 'cors';
import pool from './db.js';
import dotenv from 'dotenv';
import { createServer } from "http";
import { Server } from "socket.io";
import http from "http";
import { io as ClientIO } from "socket.io-client";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: ["http://localhost:5173",
//       "http://192.168.1.9:5173",
//       "https://5678bb51d1cb.ngrok-free.app"],
//     credentials: true,
//   }
// });

app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://10.218.27.119:5173",
    "http://10.218.27.119:5174"
  ],
  credentials: true, // allow cookies
}));
app.use(json());
app.use(cookieParser());

// Import routes
import userRoutes from './routes/userRoutes.js';
import addressRoutes from './routes/addressRoutes.js';
import otpRoutes from './routes/otpRoutes.js';
import productRoutes from "./routes/productRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import couponRoutes from "./routes/couponRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import collectionRoutes from "./routes/collectionRoutes.js";
import categorytitleRoutes from './routes/categorytitleRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import employeeRoutes from './routes/employeeRoutes.js';
import roleRoutes from './routes/roleRoutes.js';
import permissionRoutes from './routes/permissionRoutes.js';

// Register routes
app.use('/api/users', userRoutes);
app.use('/api/address', addressRoutes);
app.use('/api/auth', otpRoutes);
app.use("/api/products", productRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/collections", collectionRoutes);
app.use("/api/uploads", express.static("uploads"));
app.use("/api/categorytitle", categorytitleRoutes);

//admin routes
app.use("/api/admin", adminRoutes);
app.use("/api/employee", employeeRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/permissions", permissionRoutes);

// io.on("connection", (socket) => {
//   console.log("User connected:", socket.id);

//   socket.on("join", ({ chatId }) => {
//     socket.join(chatId);
//     console.log(`Socket ${socket.id} joined room ${chatId}`);
//   });

//   socket.on("send_message", (msg) => {
//     io.to(msg.chatId).emit("new_message", msg);
//   });

//   socket.on("disconnect", () => {
//     console.log("User disconnected:", socket.id);
//   });
// });

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log("Client server running on 5000"));

