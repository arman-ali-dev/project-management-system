import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "http://localhost:8080/api/drive/folders";

const getToken = () => localStorage.getItem("jwt");

// Fetch all folders
export const fetchFolders = createAsyncThunk(
  "folder/fetchFolders",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(BASE_URL, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      console.log("Fetched folders:", data);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

// Create a new folder
export const createFolder = createAsyncThunk(
  "folder/createFolder",
  async (name, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${BASE_URL}?name=${name}`,
        {},
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        },
      );
      console.log("Folder created:", data);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

// Delete a folder
export const deleteFolder = createAsyncThunk(
  "folder/deleteFolder",
  async (folderId, { rejectWithValue }) => {
    try {
      await axios.delete(`${BASE_URL}/${folderId}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      console.log("Folder deleted:", folderId);
      return folderId;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

const initialState = {
  folders: [],
  loading: false,
  error: null,
};

const folderSlice = createSlice({
  name: "folder",
  initialState,
  reducers: {
    clearFolderError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Folders
      .addCase(fetchFolders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFolders.fulfilled, (state, action) => {
        state.loading = false;
        state.folders = action.payload;
      })
      .addCase(fetchFolders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create Folder
      .addCase(createFolder.pending, (state) => {
        state.error = null;
      })
      .addCase(createFolder.fulfilled, (state, action) => {
        state.folders = [action.payload, ...state.folders];
      })
      .addCase(createFolder.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Delete Folder
      .addCase(deleteFolder.pending, (state) => {
        state.error = null;
      })
      .addCase(deleteFolder.fulfilled, (state, action) => {
        state.folders = state.folders.filter((f) => f.id !== action.payload);
      })
      .addCase(deleteFolder.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default folderSlice.reducer;
export const { clearFolderError } = folderSlice.actions;
