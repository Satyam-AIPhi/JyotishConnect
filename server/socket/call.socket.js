module.exports = function setupCallHandlers(io, socket, onlineUsers) {
    // =============== CALL EVENTS ===============
    socket.on('callUser', ({ recipientId, signalData, callType, callerName }) => {
      console.log(`Call initiated by ${socket.user.id} to ${recipientId}`);
  
      const recipientSocket = [...onlineUsers.values()]
        .find(u => u.userId === recipientId)?.socketId;
  
      if (recipientSocket) {
        io.to(recipientSocket).emit('incomingCall', {
          callerId: socket.user.id,
          callerName,
          signalData,
          callType
        });
      }
    });
  
    socket.on('answerCall', ({ callerId, signalData }) => {
      console.log("[Server] answerCall =>", callerId);
      const callerSocket = [...onlineUsers.values()]
        .find(u => u.userId === callerId)?.socketId;
  
      if (callerSocket) {
        io.to(callerSocket).emit('callAccepted', signalData);
      }
    });
  
    socket.on("rejectCall", ({ callerId }) => {
      console.log("[Server] rejectCall =>", callerId);
      const callerSocket = [...onlineUsers.values()]
        .find(u => u.userId === callerId)?.socketId;
  
      if (callerSocket) {
        io.to(callerSocket).emit('callRejected');
      }
    });
  
    socket.on("endCall", () => {
      console.log("[Server] endCall from", socket.user.id);
  
      // Since we don't receive a 'targetId' in this example,
      // we can broadcast to the other side by searching the chat participants
      // but typically you might pass in 'targetId' too. For now, we broadcast 
      // to all peers, or you can store a call map to know who is in the call.
      // Here, we do something simpler: just emit "callEnded" to all
      // in practice you'd want to identify the correct target user.
      // For 1-to-1, you can store "caller <-> callee" mapping and send specifically.
  
      socket.broadcast.emit("callEnded");
    });
  };
  