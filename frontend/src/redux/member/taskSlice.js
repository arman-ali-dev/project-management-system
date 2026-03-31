import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchMyTasks = createAsyncThunk(
  "task/fetchMyTasks",
  async (filterData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("jwt");

      let url = "http://localhost:8080/api/tasks/my";

      if (filterData?.status) {
        url += `?status=${filterData.status}`;
      }

      if (filterData?.priority) {
        url += `?priority=${filterData.priority}`;
      }

      const { data } = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Fetched tasks successfully", data);

      return data;
    } catch (err) {
      console.log("tasks: ", err);
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

export const updateTaskStatus = createAsyncThunk(
  "task/updateTaskStatus",
  async ({ taskId, status }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("jwt");

      const { data } = await axios.patch(
        `http://localhost:8080/api/tasks/${taskId}/status?status=${status}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log("Changed task status successfully", data);

      return data;
    } catch (err) {
      console.log("tasks: ", err.message);
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

export const fetchTasksByProject = createAsyncThunk(
  "task/fetchTasksByProject",
  async (projectId, { rejectWithValue }) => {
    try {
      console.log("project ", projectId);

      const token = localStorage.getItem("jwt");

      const { data } = await axios.get(
        `http://localhost:8080/api/tasks/projects/${projectId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log("Fetched tasks by project", data);

      return data;
    } catch (err) {
      console.log("tasks: ", err);
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

// Calendar API - Get tasks count by date for a specific month
export const fetchTasksCalendar = createAsyncThunk(
  "task/fetchTasksCalendar",
  async ({ month, year }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("jwt");

      const { data } = await axios.get(
        `http://localhost:8080/api/tasks/calendar?month=${month}&year=${year}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log("Fetched calendar tasks", data);

      return data;
    } catch (err) {
      console.log("calendar tasks error: ", err);
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

// Get full task details by date range for modal
export const fetchTasksByDateRange = createAsyncThunk(
  "task/fetchTasksByDateRange",
  async ({ month, year }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("jwt");

      const { data } = await axios.get(
        `http://localhost:8080/api/tasks/calendar/details?month=${month}&year=${year}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log("Fetched task details by date", data);

      return data;
    } catch (err) {
      console.log("task details error: ", err);
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

const initialState = {
  tasks: [],
  loading: false,
  error: null,

  tasksByProject: [],
  loadingProjectTasks: false,

  // Calendar state
  calendarTasks: {}, // { "2026-01-01": 2, "2026-01-05": 1 }
  loadingCalendar: false,

  // Tasks by date with full details
  tasksByDate: {}, // { "2026-01-01": [{task1}, {task2}], "2026-01-05": [{task3}] }
};

const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    updateTaskStatusLocal: (state, action) => {
      const { taskId, status } = action.payload;

      const task = state.tasks.find((t) => t.id == taskId);

      if (task) {
        task.status = status;
      }
    },

    updateProjectTaskStatusLocal: (state, action) => {
      const { taskId, status } = action.payload;

      const task = state.tasksByProject.find((t) => t.id == taskId);

      if (task) {
        task.status = status;
      }
    },

    addTaskToProject: (state, action) => {
      state.tasksByProject = [action.payload, ...state.tasksByProject];
    },

    addMembersToTask: (state, action) => {
      state.tasksByProject = state.tasksByProject.map((task) =>
        task.id == action.payload.id ? action.payload : task,
      );
    },

    clearTasksProject: (state, action) => {
      state.tasksByProject = [];
    },

    clearCalendarTasks: (state) => {
      state.calendarTasks = {};
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchMyTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchMyTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Task Status
      .addCase(updateTaskStatus.pending, (state) => {
        state.error = null;
      })
      .addCase(updateTaskStatus.fulfilled, (state, action) => {
        state.tasks = state.tasks.map((t) =>
          t.id === action.payload.id ? action.payload : t,
        );
      })
      .addCase(updateTaskStatus.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Get Tasks By Project
      .addCase(fetchTasksByProject.pending, (state) => {
        state.loadingProjectTasks = true;
        state.error = null;
      })
      .addCase(fetchTasksByProject.fulfilled, (state, action) => {
        state.loadingProjectTasks = false;
        state.tasksByProject = action.payload;
      })
      .addCase(fetchTasksByProject.rejected, (state, action) => {
        state.loadingProjectTasks = false;
        state.error = action.payload;
      })

      // Get Calendar Tasks
      .addCase(fetchTasksCalendar.pending, (state) => {
        state.loadingCalendar = true;
        state.error = null;
      })
      .addCase(fetchTasksCalendar.fulfilled, (state, action) => {
        state.loadingCalendar = false;
        state.calendarTasks = action.payload;
      })
      .addCase(fetchTasksCalendar.rejected, (state, action) => {
        state.loadingCalendar = false;
        state.error = action.payload;
      })

      // Get Tasks By Date Range (full details)
      .addCase(fetchTasksByDateRange.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchTasksByDateRange.fulfilled, (state, action) => {
        state.tasksByDate = action.payload;
      })
      .addCase(fetchTasksByDateRange.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default taskSlice.reducer;
export const {
  updateTaskStatusLocal,
  updateProjectTaskStatusLocal,
  clearTasksProject,
  addTaskToProject,
  addMembersToTask,
  clearCalendarTasks,
} = taskSlice.actions;
