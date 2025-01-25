const express = require("express");
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const http = require('http');
const initializeSocket = require('./socket/socket');

// Load environment variables
dotenv.config(); 
const PORT = process.env.PORT || 3000; 

// Initialize express app
const app = express();

// Create HTTP server with Express app
const server = http.createServer(app);

// Initialize Socket.IO
const io = initializeSocket(server);

// ============== DB Connection =============
mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("db connected successfully"))
.catch((err) => {
  console.log("err in connecting to database", err);
  process.exit(1);
});

// ============== Middlewares =============
app.use(cors({
  origin: 'https://jyotish-connect.vercel.app', 
  credentials: true,
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept"],
}));

app.use(express.json({ limit: '50mb' })); 
app.use(cookieParser());

// ============== Routes =============
// Auth Routes
const authRouter = require('./routes/auth.routes');
const userRouter = require('./routes/user.routes');

app.use('/api/v1', authRouter);
app.use('/api/v1/users', userRouter);

// Astrologer Routes
const astrologerRouter = require('./routes/astrologer.routes');
app.use('/api/v1/astrologers', astrologerRouter);

// Review Routes
const reviewRouter = require('./routes/review.routes');
app.use('/api/v1/reviews', reviewRouter);

// Chat Routes
const chatRouter = require('./routes/chat.routes');
app.use('/api/v1/chat', chatRouter);

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
