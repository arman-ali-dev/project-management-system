import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE = "https://apislack.a2groups.org";

const getToken = () => localStorage.getItem("jwt");

export const getComments = createAsyncThunk(
  "comments/getComments",
  async (taskId, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE}/api/tasks/${taskId}/comments`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      return { taskId, comments: res.data };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load comments",
      );
    }
  },
);

export const addComment = createAsyncThunk(
  "comments/addComment",
  async ({ taskId, content }, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${BASE}/api/tasks/${taskId}/comments`,
        { content },
        { headers: { Authorization: `Bearer ${getToken()}` } },
      );
      return { taskId, comment: res.data };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to add comment",
      );
    }
  },
);

export const deleteComment = createAsyncThunk(
  "comments/deleteComment",
  async ({ taskId, commentId }, { rejectWithValue }) => {
    try {
      await axios.delete(`${BASE}/api/tasks/${taskId}/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      return { taskId, commentId };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete comment",
      );
    }
  },
);

const commentSlice = createSlice({
  name: "comments",
  initialState: {
    byTaskId: {},
    loading: {},
    error: {},
    sending: false,
    sendError: null,
  },
  reducers: {
    clearComments: (state, action) => {
      const taskId = action.payload;
      delete state.byTaskId[taskId];
      delete state.loading[taskId];
      delete state.error[taskId];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getComments.pending, (state, action) => {
        const taskId = action.meta.arg;
        state.loading[taskId] = true;
        state.error[taskId] = null;
      })
      .addCase(getComments.fulfilled, (state, action) => {
        const { taskId, comments } = action.payload;
        state.loading[taskId] = false;
        state.byTaskId[taskId] = comments;
      })
      .addCase(getComments.rejected, (state, action) => {
        const taskId = action.meta.arg;
        state.loading[taskId] = false;
        state.error[taskId] = action.payload;
      });

    builder
      .addCase(addComment.pending, (state) => {
        state.sending = true;
        state.sendError = null;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        const { taskId, comment } = action.payload;
        state.sending = false;
        // prepend (newest first, matching backend DESC order)
        state.byTaskId[taskId] = [comment, ...(state.byTaskId[taskId] || [])];
      })
      .addCase(addComment.rejected, (state, action) => {
        state.sending = false;
        state.sendError = action.payload;
      });

    builder.addCase(deleteComment.fulfilled, (state, action) => {
      const { taskId, commentId } = action.payload;
      state.byTaskId[taskId] = (state.byTaskId[taskId] || []).filter(
        (c) => c.id !== commentId,
      );
    });
  },
});

export const { clearComments } = commentSlice.actions;
export default commentSlice.reducer;

export const selectComments = (taskId) => (state) =>
  state.comments.byTaskId[taskId] || [];
export const selectCLoading = (taskId) => (state) =>
  state.comments.loading[taskId] || false;
export const selectCError = (taskId) => (state) =>
  state.comments.error[taskId] || null;
export const selectCSending = (state) => state.comments.sending;
export const selectCSendError = (state) => state.comments.sendError;
