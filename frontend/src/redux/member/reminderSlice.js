import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchReminders = createAsyncThunk(
  "reminder/fetchReminders",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("jwt");

      const { data } = await axios.get(
        "http://localhost:8080/api/tasks/reminders",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      console.log("Reminders: ", data);

      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  },
);

const reminderSlice = createSlice({
  name: "reminder",
  initialState: {
    reminders: [],
    loading: false,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReminders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchReminders.fulfilled, (state, action) => {
        state.loading = false;
        state.reminders = action.payload;
      })
      .addCase(fetchReminders.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default reminderSlice.reducer;
