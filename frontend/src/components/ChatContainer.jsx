// ChatContainer.jsx

import { useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";

import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { formatMessageTime } from "../lib/utils";

const ChatContainer = () => {
  const { messages, getMessages, selectedUser, isMessagesLoading, addMessage } =
    useChatStore();

  const { authUser, socket } = useAuthStore();
  const messageEndRef = useRef(null);

  // Fetch old messages when user is selected
  useEffect(() => {
    if (selectedUser?._id) {
      getMessages(selectedUser._id);
    }
  }, [selectedUser, getMessages]);

  // Real-time socket listener (FIXED)
  useEffect(() => {
    if (!socket || !selectedUser) return;

    const handleNewMessage = (newMessage) => {
      const isMessageForCurrentChat =
        newMessage.senderId.toString() === selectedUser._id.toString() ||
        newMessage.receiverId.toString() === selectedUser._id.toString();

      if (isMessageForCurrentChat) {
        addMessage(newMessage);
      }
    };

    socket.on("receiveMessage", handleNewMessage);

    return () => {
      socket.off("receiveMessage", handleNewMessage);
    };
  }, [socket, selectedUser, addMessage]);

  // Auto scroll
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  if (!selectedUser) return null;

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <ChatInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => {
          const isMe = message.senderId.toString() === authUser?._id.toString();

          return (
            <div
              key={message._id}
              className={`chat ${isMe ? "chat-end" : "chat-start"}`}
            >
              <div className="chat-image avatar">
                <div className="size-10 rounded-full border">
                  <img
                    src={
                      isMe
                        ? authUser?.profilePic || "/avatar.png"
                        : selectedUser?.profilePic || "/avatar.png"
                    }
                    alt="profile"
                  />
                </div>
              </div>

              <div className="chat-header mb-1">
                <time className="text-xs opacity-50 ml-1">
                  {formatMessageTime(message.createdAt)}
                </time>
              </div>

              <div className="chat-bubble flex flex-col">
                {message.image && (
                  <img
                    src={message.image}
                    className="sm:max-w-[200px] rounded-md mb-2"
                    alt=""
                  />
                )}

                {message.text && <p>{message.text}</p>}
              </div>
            </div>
          );
        })}

        <div ref={messageEndRef} />
      </div>

      <ChatInput />
    </div>
  );
};

export default ChatContainer;
