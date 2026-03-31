import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchChatRooms = createAsyncThunk(
  "chat/fetchChatRooms",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("jwt");

      const { data } = await axios.get(
        `http://localhost:8080/api/chat/rooms/groups`,
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

const chatRoomSlice = createSlice({
  name: "chatRoom",
  initialState: {
    chatRooms: [],
    loading: false,
    error: null,

    selectedChatRoom: null,
  },
  reducers: {
    selectChatRoom: (state, action) => {
      state.selectedChatRoom = action.payload;
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
      });
  },
});

export const { selectChatRoom } = chatRoomSlice.actions;
export default chatRoomSlice.reducer;
