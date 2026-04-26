import { X, Bot } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();


  const isAIChat = selectedUser?._id === "ai-chat";


  const isOnline = isAIChat ? true : onlineUsers.includes(selectedUser?._id);

  return (
    <div className="px-5 py-4 border-b border-base-300 bg-base-100 shadow-sm">
      <div className="flex items-center justify-between">
        {/* Left Side */}
        <div className="flex items-center gap-4">
          {/* Avatar */}
          {isAIChat ? (
            <img
              src="/bot.png"
              alt="AI Assistant"
              className="size-12 rounded-full object-cover border"
            />
          ) : (
            <img
              src={selectedUser?.profilePic || "/avatar.png"}
              alt={selectedUser?.fullName}
              className="size-12 rounded-full object-cover border"
            />
          )}


          <div>
            <h2 className="font-semibold text-base">
              {isAIChat ? "AI Assistant" : selectedUser?.fullName}
            </h2>

            <p
              className={`text-sm font-medium ${
                isOnline ? "text-green-500" : "text-gray-400"
              }`}
            >
              {isAIChat ? "Always Online" : isOnline ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        {/* Right Side */}
        <button
          onClick={() => setSelectedUser(null)}
          className="p-2 rounded-full hover:bg-base-200 transition"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
