import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { Users } from "lucide-react";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } =
    useChatStore();

  const { onlineUsers } = useAuthStore();

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  if (isUsersLoading) return <SidebarSkeleton />;

  const aiUser = {
    _id: "ai-chat",
    fullName: "AI Assistant",
    profilePic: "/bot.png",
    isAI: true,
  };

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col">
      
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <span className="font-semibold hidden lg:block">Contacts</span>
        </div>
      </div>

      <div className="overflow-y-auto w-full py-2">

        <button
          onClick={() => setSelectedUser(aiUser)}
          className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-base-300 transition ${
            selectedUser?._id === aiUser._id ? "bg-base-300" : ""
          }`}
        >

          <img
            src="/bot.png"
            alt="AI Assistant"
            className="size-12 rounded-full object-cover border"
          />

          <div className="hidden lg:block text-left min-w-0 flex-1">
            <p className="font-medium truncate">AI Assistant</p>

            <p className="text-sm font-medium text-green-500">Always Online</p>
          </div>
        </button>


        {users.map((user) => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-base-300 transition ${
              selectedUser?._id === user._id ? "bg-base-300" : ""
            }`}
          >
            <img
              src={user.profilePic || "/avatar.png"}
              alt={user.fullName}
              className="size-12 rounded-full object-cover"
            />

            <div className="hidden lg:block text-left min-w-0 flex-1">
              <p className="font-medium truncate">{user.fullName}</p>

              <p
                className={`text-sm font-medium ${
                  onlineUsers.includes(user._id)
                    ? "text-green-500"
                    : "text-gray-400"
                }`}
              >
                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
              </p>
            </div>
          </button>
        ))}

        {users.length === 0 && (
          <div className="text-center text-gray-500 py-4">No users found</div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
