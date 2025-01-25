const socketIO = require('socket.io');
const jwt = require('jsonwebtoken');

// Import our separated socket handlers
const setupCallHandlers = require('./call.socket');
const setupChatHandlers = require('./chat.socket');

function initializeSocket(server) {
  const io = socketIO(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  // Store online users
  const onlineUsers = new Map();

  // Middleware to parse token from cookie
  io.use((socket, next) => {
    try {
      const rawCookie = socket.handshake.headers.cookie || '';
      const cookieName = 'access_token=';
      const startIndex = rawCookie.indexOf(cookieName);
      if (startIndex === -1) throw new Error('No token cookie');

      // Extract the token from the cookie string
      const tokenValue = rawCookie
        .slice(startIndex + cookieName.length)
        .split(';')[0];

      const decoded = jwt.verify(tokenValue, process.env.JWT_SECRET);
      socket.user = decoded;
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });


  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.user.id}`);

    // Add user to the Map
    onlineUsers.set(socket.user.id, {
      socketId: socket.id,
      userId: socket.user.id,
      role: socket.user.role,
    });

    // If astrologer, broadcast status
    if (socket.user.role === 'Astrologer') {
      io.emit('astrologerStatusUpdate', {
        astrologerId: socket.user.id,
        status: 'online'
      });
    }

    // ======================
    // REGISTER HANDLERS
    // ======================
    setupCallHandlers(io, socket, onlineUsers);
    setupChatHandlers(io, socket, onlineUsers);

    // On disconnect
    socket.on('disconnect', () => {
      onlineUsers.delete(socket.user.id);
      if (socket.user.role === 'Astrologer') {
        io.emit('astrologerStatusUpdate', {
          astrologerId: socket.user.id,
          status: 'offline'
        });
      }
    });
  });

  return io;
}

module.exports = initializeSocket;
