import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const BASE = "http://localhost:8081";

export const getMyScore = createAsyncThunk(
  "score/getMyScore",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("jwt");
      const res = await axios.get(`${BASE}/api/scores/me`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed");
    }
  },
);

export const getLeaderboard = createAsyncThunk(
  "score/getLeaderboard",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("jwt");
      const res = await axios.get(`${BASE}/api/scores/leaderboard`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed");
    }
  },
);

export const getUserScore = createAsyncThunk(
  "score/getUserScore",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE}/api/scores/${userId}`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed");
    }
  },
);

const scoreSlice = createSlice({
  name: "score",
  initialState: {
    myScore: null,
    leaderboard: [],
    selected: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getMyScore.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyScore.fulfilled, (state, action) => {
        state.loading = false;
        state.myScore = action.payload;
      })
      .addCase(getMyScore.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getLeaderboard.pending, (state) => {
        state.loading = true;
      })
      .addCase(getLeaderboard.fulfilled, (state, action) => {
        state.loading = false;
        state.leaderboard = action.payload;
      })
      .addCase(getLeaderboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getUserScore.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserScore.fulfilled, (state, action) => {
        state.loading = false;
        state.selected = action.payload;
      })
      .addCase(getUserScore.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default scoreSlice.reducer;
