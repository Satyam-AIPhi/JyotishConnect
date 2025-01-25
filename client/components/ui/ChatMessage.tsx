"use client";

import React from "react";
import { FaCheckDouble } from "react-icons/fa";
import Image from "next/image";

interface ChatMessageProps {
  message: {
    sender: { _id: string; avatar?: string };
    content: string;
    createdAt: string;
    type: string;
  };
  currentUserId: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, currentUserId }) => {
  // Determine if the message was sent by the logged-in user
  const isSentByUser = message.sender?._id === currentUserId;

  // Fallback avatar URL
  const fallbackAvatar = "/default-avatar.png";

  return (
    <div className={`flex items-end my-2 ${isSentByUser ? "justify-end" : "justify-start"}`}>
      {/* For messages not sent by the current user, show avatar on the left */}
      {!isSentByUser && (
        <Image
          src={message.sender?.avatar || fallbackAvatar}
          alt="Avatar"
          width={32}
          height={32}
          className="w-8 h-8 rounded-full object-cover mx-2"
        />
      )}

      {/* Message bubble */}
      <div
        className={`max-w-[70%] p-3 rounded-xl shadow-sm ${
          isSentByUser
            ? "bg-blue-500 text-white rounded-bl-none"
            : "bg-gray-200 text-black rounded-br-none"
        }`}
      >
        <p className="break-words whitespace-pre-wrap">{message.content}</p>
        <div className="flex justify-end items-center mt-1 text-xs text-gray-600">
          <span>
            {new Date(message.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
          {/* Optional read receipt for messages sent by the current user */}
          {isSentByUser && <FaCheckDouble className="ml-1 text-green-300" />}
        </div>
      </div>

      {/* For messages sent by the current user, show avatar on the right */}
      {isSentByUser && (
        <Image
          src={message.sender?.avatar || fallbackAvatar}
          alt="Avatar"
          width={32}
          height={32}
          className="w-8 h-8 rounded-full object-cover mx-2"
        />
      )}
    </div>
  );
};

export default ChatMessage;
