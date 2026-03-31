import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchProjects = createAsyncThunk(
  "adminProject/fetchProjects",
  async (filterData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("jwt");

      let url = "http://localhost:8080/api/projects/all";

      if (filterData?.status) {
        url += `?status=${filterData.status}`;
      }

      if (filterData?.priority) {
        url += `?priority=${filterData.priority}`;
      }

      console.log(url);

      const { data } = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Fetched projects successfully", data);

      return data;
    } catch (err) {
      console.log("admin projects: ", err);
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

export const createProject = createAsyncThunk(
  "adminProject/createProject",
  async (projectData, { rejectWithValue }) => {
    console.log("Creating project with data:", projectData);

    try {
      const token = localStorage.getItem("jwt");
      const { data } = await axios.post(
        "http://localhost:8080/api/admin/projects",
        projectData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log("Created project successfully", data);

      return data;
    } catch (err) {
      console.log("admin projects: ", err);
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

export const updateProject = createAsyncThunk(
  "adminProject/updateProject",
  async (projectData, { rejectWithValue }) => {
    console.log("Updating project with data:", projectData);

    try {
      const token = localStorage.getItem("jwt");
      const { data } = await axios.put(
        `http://localhost:8080/api/admin/projects/${projectData.id}`,
        projectData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log("Updated project successfully", data);

      return data;
    } catch (err) {
      console.log("admin projects: ", err);
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

export const deleteProject = createAsyncThunk(
  "adminProject/deleteProject",
  async (id, { rejectWithValue }) => {
    console.log("Deleting project with id:", id);

    try {
      const token = localStorage.getItem("jwt");
      const { data } = await axios.delete(
        `http://localhost:8080/api/admin/projects/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log("Deleted project successfully", data);

      return id;
    } catch (err) {
      console.log("admin projects: ", err);
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

export const searchProjects = createAsyncThunk(
  "adminProject/searchProjects",
  async (keyword, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("jwt");

      const { data } = await axios.get(
        `http://localhost:8080/api/projects/search?keyword=${keyword}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log("admin projects: ", data);

      return data;
    } catch (err) {
      console.log("admin projects: ", err);

      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

const initialState = {
  projects: [],
  loading: false,
  error: null,

  createProjectLoading: false,

  updateProjectLoading: false,

  deletedProjectId: null,
};

const projectSlice = createSlice({
  name: "adminProject",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create Project
      .addCase(createProject.pending, (state) => {
        state.createProjectLoading = true;
        state.error = null;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.createProjectLoading = false;
        state.projects = [action.payload, ...state.projects];
      })
      .addCase(createProject.rejected, (state, action) => {
        state.createProjectLoading = false;
        state.error = action.payload;
      })

      // Update Project
      .addCase(updateProject.pending, (state) => {
        state.updateProjectLoading = true;
        state.error = null;
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.updateProjectLoading = false;
        state.projects = state.projects.map((project) =>
          project.id == action.payload.id ? action.payload : project,
        );
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.updateProjectLoading = false;
        state.error = action.payload;
      })

      // Delete Project
      .addCase(deleteProject.pending, (state, action) => {
        state.deletedProjectId = action.meta.arg;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.deletedProjectId = null;
        state.projects = state.projects.filter(
          (project) => project.id !== action.payload,
        );
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.deletedProjectId = null;
        state.error = action.payload;
      })

      // Search Projects
      .addCase(searchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload;
      })
      .addCase(searchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default projectSlice.reducer;
