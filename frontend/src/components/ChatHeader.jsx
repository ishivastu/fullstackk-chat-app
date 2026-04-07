import { X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  // ✅ prevent crash
  if (!selectedUser) return null;

  const isOnline = onlineUsers?.includes(selectedUser._id);

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        {/* LEFT SIDE */}
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img
                src={selectedUser.profilePic || "/avatar.png"}
                alt={selectedUser.fullName}
              />
            </div>
          </div>

          {/* User Info */}
          <div>
            <h3 className="font-medium">{selectedUser.fullName}</h3>

            <p className="text-sm text-base-content/70">
              {isOnline ? "🟢 Online" : "⚫ Offline"}
            </p>
          </div>
        </div>

        {/* RIGHT SIDE (close button) */}
        <button
          onClick={() => setSelectedUser(null)}
          className="btn btn-sm btn-circle"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
