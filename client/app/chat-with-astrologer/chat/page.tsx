
"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useParams } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { io, Socket } from "socket.io-client";
import ChatUI from "./ChatUI";
import CallUI from "./CallUI";
import Image from "next/image";

interface Participant {
  _id: string;
  name: string;
  avatar: string;
}

interface ChatItem {
  _id: string;
  userId: Participant;
  astrologerId: Participant;
}

const ChatContent = () => {
  const searchParams = useSearchParams();
  const chatId = searchParams.get("chatId");
  const params = useParams();
  const astrologerId = params.id as string;

  // Redux user
  const user = useSelector((state: RootState) => state.user.user);

  // Socket instance with proper type
  const [socket, setSocket] = useState<Socket | null>(null);

  // Chat list with proper type
  const [chatList, setChatList] = useState<ChatItem[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(
    chatId || null
  );

  // 1) Initialize Socket
  useEffect(() => {
    const newSocket = io(`${process.env.NEXT_PUBLIC_BACKEND_URL}`, {
      withCredentials: true,
    });
    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  // 2) Fetch Chat List
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/chat/list`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        setChatList(data);
      })
      .catch((err) => console.error("Error fetching chat list:", err));
  }, []);

  // 3) Figure out the “other participant” from chatList + selectedChatId
  const selectedChatData = chatList.find((chat) => chat._id === selectedChatId);
  const participant = selectedChatData
    ? selectedChatData.userId._id === user?._id
      ? selectedChatData.astrologerId
      : selectedChatData.userId
    : null;

  return (
    <div className="flex h-screen">
      {/* -- Left side: Chat List -- */}
      <div className="w-1/4 border-r border-gray-300 flex flex-col">
        <h2 className="p-4 font-bold text-lg">Chat History</h2>
        <div className="flex-1 overflow-y-auto">
          {chatList.map((chat) => {
            const chatParticipant =
              chat.userId._id === user?._id ? chat.astrologerId : chat.userId;
            return (
              <div
                key={chat._id}
                onClick={() => setSelectedChatId(chat._id)}
                className={`p-3 border-b cursor-pointer flex items-center
                  ${selectedChatId === chat._id
                    ? "bg-gray-200"
                    : "hover:bg-gray-100"
                  }`}
              >
                <Image
                  src={chatParticipant.avatar}
                  alt="Avatar"
                  width={100}
                  height={100}
                  className="w-8 h-8 rounded-full object-cover mx-2"
                />
                <div className="font-semibold">{chatParticipant.name}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* -- Right side: Chat + Call UI -- */}
      <div className="flex-1 flex flex-col relative">
        {selectedChatId && socket ? (
          participant ? (
            <>
              <CallUI
                socket={socket}
                user={user}
                participant={participant}
                chatId={selectedChatId}
                astrologerId={astrologerId}
              />
              <ChatUI
                socket={socket}
                selectedChatId={selectedChatId}
                user={user}
              />
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              Loading participant details...
            </div>
          )
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            {selectedChatId ? 'Connecting...' : 'Select a chat to start messaging'}
          </div>
        )}
      </div>
    </div>
  );
};

export default function ChatPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ChatContent />
    </Suspense>
  );
};
