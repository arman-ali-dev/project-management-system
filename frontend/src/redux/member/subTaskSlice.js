import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const BASE = "https://apislack.a2groups.org";

export const getSubtasks = createAsyncThunk(
  "subtask/getSubtasks",
  async (taskId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("jwt");
      const res = await axios.get(`${BASE}/api/tasks/${taskId}/subtasks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return { taskId, subtasks: res.data };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load subtasks",
      );
    }
  },
);

export const addSubtask = createAsyncThunk(
  "subtask/addSubtask",
  async ({ taskId, title, assignedToId }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("jwt");
      const res = await axios.post(
        `${BASE}/api/tasks/${taskId}/subtasks`,
        { title, assignedToId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return { taskId, subtask: res.data };
    } catch (err) {
      console.log(err);
      return rejectWithValue(
        err.response?.data?.message || "Failed to add subtask",
      );
    }
  },
);

export const toggleSubtaskComplete = createAsyncThunk(
  "subtask/toggleComplete",
  async ({ taskId, subtaskId }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("jwt");

      const res = await axios.patch(
        `${BASE}/api/tasks/${taskId}/subtasks/${subtaskId}/toggle`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return { taskId, subtask: res.data };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to toggle subtask",
      );
    }
  },
);

export const editSubtask = createAsyncThunk(
  "subtask/editSubtask",
  async ({ taskId, subtaskId, title, assignedToId }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("jwt");

      const res = await axios.put(
        `${BASE}/api/tasks/${taskId}/subtasks/${subtaskId}`,
        { title, assignedToId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return { taskId, subtask: res.data };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update subtask",
      );
    }
  },
);

export const deleteSubtask = createAsyncThunk(
  "subtask/deleteSubtask",
  async ({ taskId, subtaskId }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("jwt");

      await axios.delete(`${BASE}/api/tasks/${taskId}/subtasks/${subtaskId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return { taskId, subtaskId };
    } catch (err) {
      console.log(err);

      return rejectWithValue(
        err.response?.data?.message || "Failed to delete subtask",
      );
    }
  },
);

const subTaskSlice = createSlice({
  name: "subtask",
  initialState: {
    byTaskId: {}, // { [taskId]: Subtask[] }
    loading: {}, // { [taskId]: boolean }
    error: {}, // { [taskId]: string | null }
    sending: false,
    sendError: null,
  },
  reducers: {
    clearSubtasks: (state, action) => {
      const taskId = action.payload;
      delete state.byTaskId[taskId];
      delete state.loading[taskId];
      delete state.error[taskId];
    },
  },
  extraReducers: (builder) => {
    builder
      // getSubtasks
      .addCase(getSubtasks.pending, (state, action) => {
        const taskId = action.meta.arg;
        state.loading[taskId] = true;
        state.error[taskId] = null;
      })
      .addCase(getSubtasks.fulfilled, (state, action) => {
        const { taskId, subtasks } = action.payload;
        state.loading[taskId] = false;
        state.byTaskId[taskId] = subtasks;
      })
      .addCase(getSubtasks.rejected, (state, action) => {
        const taskId = action.meta.arg;
        state.loading[taskId] = false;
        state.error[taskId] = action.payload;
      })

      // addSubtask
      .addCase(addSubtask.pending, (state) => {
        state.sending = true;
        state.sendError = null;
      })
      .addCase(addSubtask.fulfilled, (state, action) => {
        const { taskId, subtask } = action.payload;
        state.sending = false;
        state.byTaskId[taskId] = [...(state.byTaskId[taskId] || []), subtask];
      })
      .addCase(addSubtask.rejected, (state, action) => {
        state.sending = false;
        state.sendError = action.payload;
      })

      // toggleSubtaskComplete
      .addCase(toggleSubtaskComplete.fulfilled, (state, action) => {
        const { taskId, subtask } = action.payload;
        state.byTaskId[taskId] = (state.byTaskId[taskId] || []).map((s) =>
          s.id === subtask.id ? subtask : s,
        );
      })

      // editSubtask
      .addCase(editSubtask.fulfilled, (state, action) => {
        const { taskId, subtask } = action.payload;
        state.byTaskId[taskId] = (state.byTaskId[taskId] || []).map((s) =>
          s.id === subtask.id ? subtask : s,
        );
      })

      // deleteSubtask
      .addCase(deleteSubtask.fulfilled, (state, action) => {
        const { taskId, subtaskId } = action.payload;
        state.byTaskId[taskId] = (state.byTaskId[taskId] || []).filter(
          (s) => s.id !== subtaskId,
        );
      });
  },
});

export const { clearSubtasks } = subTaskSlice.actions;
export default subTaskSlice.reducer;

export const selectSubtasks = (taskId) => (state) =>
  state.subtask?.byTaskId?.[taskId] ?? [];
export const selectSTLoading = (taskId) => (state) =>
  state.subtask?.loading?.[taskId] ?? false;
export const selectSTError = (taskId) => (state) =>
  state.subtask?.error?.[taskId] ?? null;
export const selectSTSending = (state) => state.subtask?.sending ?? false;
export const selectSTSendError = (state) => state.subtask?.sendError ?? null;