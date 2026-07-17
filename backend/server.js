import express from "express";
import cors from "cors";
import 'dotenv/config';
import connectDB from "./config/mongodb.js";
import userRouter from "./routes/userRoutes.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import connectCloudinary from "./config/cloudinary.js";

// APP CONFIG
const app = express();
const port = process.env.PORT || 4000;

(async () => {
  try {
    await connectDB();
    connectCloudinary();
  } catch (error) {
    console.error('Cloudinary startup failed:', error.message);
    process.exit(1);
  }

//middlewares
const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.VITE_FRONTEND_URL,
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined,
  "http://localhost:5173",
  "http://127.0.0.1:5173"
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || /\.vercel\.app$/i.test(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked for origin: ${origin}`));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "token"]
};


app.use(cors(corsOptions));
app.options(/(.*)/, cors(corsOptions));
app.use(express.json());

// api endpoints
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use('/api/order', orderRouter);

app.get("/", (req, res) => {
  res.send("API WORKING ")
})
app.listen(port, () => console.log('Server started on port : ' + port));
})();




