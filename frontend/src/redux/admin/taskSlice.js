import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { addMembersToTask, addTaskToProject } from "../member/taskSlice";

export const fetchTasks = createAsyncThunk(
  "adminTask/fetchTasks",
  async (filterData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("jwt");

      let url = "http://localhost:8080/api/admin/tasks/all";

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

      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

export const createTask = createAsyncThunk(
  "adminTask/createTask",
  async (taskData, { rejectWithValue, dispatch }) => {
    console.log("Creating task with data:", taskData);

    try {
      const token = localStorage.getItem("jwt");
      const { data } = await axios.post(
        "http://localhost:8080/api/admin/tasks",
        taskData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      dispatch(addTaskToProject(data));

      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

export const addMemberToTask = createAsyncThunk(
  "adminTask/addMemberToTask",
  async ({ taskId, selectedMembers }, { rejectWithValue, dispatch }) => {
    try {
      const token = localStorage.getItem("jwt");
      const { data } = await axios.post(
        `http://localhost:8080/api/admin/tasks/${taskId}/members`,
        selectedMembers,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log("member added: ", data);
      dispatch(addMembersToTask(data));

      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

const initialState = {
  tasks: [],
  loading: false,
  error: null,

  createLoading: false,

  addMembersLoading: false,
};

const taskSlice = createSlice({
  name: "adminTask",
  initialState,
  reducers: {
    createNewTask: (state, action) => {},
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create Task
      .addCase(createTask.pending, (state) => {
        state.createLoading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.createLoading = false;
        state.tasks = [action.payload, ...state.tasks];
      })
      .addCase(createTask.rejected, (state, action) => {
        state.createLoading = false;
        state.error = action.payload;
      })

      // Add Members To Task
      .addCase(addMemberToTask.pending, (state) => {
        state.addMembersLoading = true;
        state.error = null;
      })
      .addCase(addMemberToTask.fulfilled, (state, action) => {
        state.addMembersLoading = false;

        state.tasks = state.tasks.map((task) =>
          task.id == action.payload.id ? action.payload : task,
        );
      })
      .addCase(addMemberToTask.rejected, (state, action) => {
        state.addMembersLoading = false;
        state.error = action.payload;
      });
  },
});

export default taskSlice.reducer;
