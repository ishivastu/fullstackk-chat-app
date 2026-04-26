import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useChatStore = create((set, get) => ({
  selectedUser: null,
  users: [],
  messages: [],
  isUsersLoading: false,
  isMessagesLoading: false,

  setSelectedUser: (user) => set({ selectedUser: user }),

  getUsers: async () => {
    set({ isUsersLoading: true });

    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error("Error fetching users");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });

    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error("Error fetching messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  // FIXED: no manual set() here
  // socket event will handle real-time UI update
  sendMessage: async (messageData) => {
    const { selectedUser } = get();

    try {
      await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData
      );
    } catch (error) {
      toast.error("Error sending message");
    }
  },

  // socket adds messages here
  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),
}));
