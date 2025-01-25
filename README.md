                (User taps call)
 Idle  ----------------->  Outgoing (Ringing)
  ^                               |
  |(Call hung up / ended)         | (Remote side Accepts)
  |                               v
  |                              Active  ---->  Ended
  |                               ^              ^
  |(Call Ended or Rejected)       | (Local Hang) |
  +-------------------------------+--------------+
  
Similarly for Incoming side:
 Idle  --->  Incoming (Ringing)  ---> Accept => Active => Ended
                                  ---> Reject => Idle



1. **Caller** clicks “Call” button.
   - Client sets local state to `Outgoing`/`Ringing`.
   - Requests local media stream (audio or video).
   - Creates `peer` as initiator.
   - On `peer.signal`, sends `callUser` event to server: `socket.emit("callUser", { recipientId, signalData, callType })`.
2. **Server** handles `callUser`.
   - Looks up callee’s socket.
   - If callee is online, `io.to(calleeSocket).emit("incomingCall", { callerId, callerName, signalData, callType })`.
   - (Optional) Start a missed call timer or DB “call record.”  
   - If callee is offline, trigger push notification (advanced scenario).
3. **Callee** gets `incomingCall`.
   - Displays incoming call UI with “Accept” / “Reject.”
   - If “Reject,” emit `rejectCall` => server => informs caller => caller sees “Call Rejected.”  
   - If “Accept,” request local media, create `peer` as `initiator: false`, and `peer.signal(signalData)`.
   - On `peer.signal`, the callee sends `answerCall` to server with the final handshake data.
4. **Server** receives `answerCall`, sends it to the original caller’s socket as `callAccepted` with the callee’s `signalData`.
   - Caller’s peer completes the WebRTC handshake => `peer.on("connect")` => we have an active call.
5. **Active call** – both sides have audio/video. UI shows “End Call” button.
   - If either side ends, `socket.emit("endCall", { targetId: otherUserId })`.
   - The server `io.to(otherUserSocket).emit("callEnded")`.
   - The other side receives `callEnded`, cleans up.
   - Both sides store final call record in DB with status, duration, etc.
6. **No answer** / “Missed Call”
   - If callee never accepted or rejected within X seconds, server emits `callMissed` => both sides. 
   - The call is ended, UI shows “Missed Call” in chat or logs.

---
