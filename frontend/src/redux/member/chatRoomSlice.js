import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchChatRooms = createAsyncThunk(
  "chat/fetchChatRooms",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("jwt");

      const { data } = await axios.get(
        `https://apislack.a2groups.org/api/chat/rooms/groups`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log("chat rooms, ", data);

      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error");
    }
  },
);

export const fetchPrivateRooms = createAsyncThunk(
  "chat/fetchPrivateRooms",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("jwt");

      const { data } = await axios.get(
        `https://apislack.a2groups.org/api/chat/rooms/private`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error");
    }
  },
);

export const openPrivateChat = createAsyncThunk(
  "chat/openPrivateChat",
  async (otherUserId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("jwt");

      const { data } = await axios.post(
        `https://apislack.a2groups.org/api/chat/rooms/private/${otherUserId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error");
    }
  },
);

const chatRoomSlice = createSlice({
  name: "chatRoom",
  initialState: {
    chatRooms: [],
    privateRooms: [],
    loading: false,
    error: null,
    selectedChatRoom: null,
  },
  reducers: {
    selectChatRoom: (state, action) => {
      state.selectedChatRoom = action.payload;
    },
    clearSelectedChatRoom: (state) => {
      state.selectedChatRoom = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChatRooms.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchChatRooms.fulfilled, (state, action) => {
        state.loading = false;
        state.chatRooms = action.payload;
      })
      .addCase(fetchChatRooms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchPrivateRooms.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPrivateRooms.fulfilled, (state, action) => {
        state.loading = false;
        state.privateRooms = action.payload;
      })
      .addCase(fetchPrivateRooms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(openPrivateChat.fulfilled, (state, action) => {
        state.selectedChatRoom = action.payload;
        const exists = state.privateRooms.some(
          (r) => r.id === action.payload.id,
        );
        if (!exists) state.privateRooms.push(action.payload);
      });
  },
});

export const { selectChatRoom, clearSelectedChatRoom } = chatRoomSlice.actions;
export default chatRoomSlice.reducer;
