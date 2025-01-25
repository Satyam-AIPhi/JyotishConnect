"use client";

import React, { useEffect, useState, useRef } from "react";
import ChatMessage from "@/components/ui/ChatMessage";
import { Socket } from "socket.io-client";

interface ChatMessageType {
  _id: string;
  sender: {
    _id: string;
    avatar?: string;
  };
  content: string;
  createdAt: string;
  type: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'astrologer' | 'admin';
}

interface ChatUIProps {
  socket: Socket;
  selectedChatId: string;
  user: User;
}

export default function ChatUI({ socket, selectedChatId, user }: ChatUIProps) {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  // Join the room + fetch existing messages
  useEffect(() => {
    if (!socket || !selectedChatId) return;

    // 1) Join the room
    socket.emit("joinRoom", { chatId: selectedChatId });

    // 2) Fetch chat messages
    const loadMessages = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/chat/${selectedChatId}`,
          { credentials: "include" }
        );
        if (!response.ok) throw new Error("Failed to fetch messages");
        const data = await response.json();
        setMessages(data.messages || []);
      } catch (error) {
        console.error("Error fetching chat messages:", error);
      }
    };
    loadMessages();

    // Clean up: leave the room
    return () => {
      socket.emit("leaveRoom", { chatId: selectedChatId });
    };
  }, [socket, selectedChatId]);

  // Socket listener for new messages
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = ({
      chatId,
      message,
    }: {
      chatId: string;
      message: ChatMessageType;
    }) => {
      if (chatId === selectedChatId) {
        setMessages((prev) => [...prev, message]);
      }
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, selectedChatId]);

  // Auto-scroll
  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Send message
  const sendMessage = () => {
    if (!currentMessage.trim()) return;
    if (socket && selectedChatId) {
      socket.emit("sendMessage", {
        chatId: selectedChatId,
        message: currentMessage,
      });
      setCurrentMessage("");
    }
  };

  return (
    <>
      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg) => (
          <ChatMessage 
            key={msg._id} 
            message={{
              sender: msg.sender,
              content: msg.content,
              createdAt: msg.createdAt,
              type: msg.type
            }} 
            currentUserId={user?._id} 
          />
        ))}
        <div ref={endOfMessagesRef} />
      </div>

      {/* INPUT */}
      <div className="p-4 flex border-t">
        <input
          className="flex-1 border p-2 rounded-lg"
          type="text"
          placeholder="Type a message..."
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="ml-2 bg-blue-500 px-4 rounded-lg text-white hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </>
  );
}
