import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "http://localhost:8080/api/documents";

const getToken = () => localStorage.getItem("jwt");

// Fetch recent files
export const fetchRecentFiles = createAsyncThunk(
  "document/fetchRecentFiles",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${BASE_URL}/recent`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      console.log("Fetched recent files:", data);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

// Fetch public files
export const fetchPublicFiles = createAsyncThunk(
  "document/fetchPublicFiles",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${BASE_URL}/public`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      console.log("Fetched public files:", data);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

// Upload file (optionally attach to a folder)
export const uploadDocument = createAsyncThunk(
  "document/uploadDocument",
  async ({ document, folderId }, { rejectWithValue }) => {
    try {
      console.log(document);

      const token = localStorage.getItem("jwt");
      const { data } = await axios.post(
        `http://localhost:8080/api/documents/upload${folderId ? "?folderId=" + folderId : ""}`,
        document,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log("File uploaded:", data);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

// Delete a document
export const deleteDocument = createAsyncThunk(
  "document/deleteDocument",
  async (fileId, { rejectWithValue }) => {
    try {
      await axios.delete(`${BASE_URL}/${fileId}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      console.log("File deleted:", fileId);
      return fileId;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

// Update document visibility (PUBLIC / PRIVATE)
export const updateDocumentVisibility = createAsyncThunk(
  "document/updateDocumentVisibility",
  async ({ fileId, visibility }, { rejectWithValue }) => {
    try {
      const { data } = await axios.patch(
        `${BASE_URL}/${fileId}/visibility?visibility=${visibility}`,
        {},
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        },
      );
      console.log("Visibility updated:", data);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

const initialState = {
  recentFiles: [],
  publicFiles: [],
  selectedFile: null,
  loading: false,
  uploading: false,
  error: null,
};

const documentSlice = createSlice({
  name: "document",
  initialState,
  reducers: {
    clearDocumentError: (state) => {
      state.error = null;
    },
    setSelectedFile: (state, action) => {
      state.selectedFile = action.payload;
    },
    clearSelectedFile: (state) => {
      state.selectedFile = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Recent Files
      .addCase(fetchRecentFiles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecentFiles.fulfilled, (state, action) => {
        state.loading = false;
        state.recentFiles = action.payload;
      })
      .addCase(fetchRecentFiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Public Files
      .addCase(fetchPublicFiles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPublicFiles.fulfilled, (state, action) => {
        state.loading = false;
        state.publicFiles = action.payload;
      })
      .addCase(fetchPublicFiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Upload Document
      .addCase(uploadDocument.pending, (state) => {
        state.uploading = true;
        state.error = null;
      })
      .addCase(uploadDocument.fulfilled, (state, action) => {
        state.uploading = false;
        // Add to both recent and public lists
        state.recentFiles = [action.payload, ...state.recentFiles];
        if (action.payload.visibility === "PUBLIC") {
          state.publicFiles = [action.payload, ...state.publicFiles];
        }
      })
      .addCase(uploadDocument.rejected, (state, action) => {
        state.uploading = false;
        state.error = action.payload;
      })

      // Delete Document
      .addCase(deleteDocument.pending, (state) => {
        state.error = null;
      })
      .addCase(deleteDocument.fulfilled, (state, action) => {
        const fileId = action.payload;
        state.recentFiles = state.recentFiles.filter((f) => f.id !== fileId);
        state.publicFiles = state.publicFiles.filter((f) => f.id !== fileId);
      })
      .addCase(deleteDocument.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Update Visibility
      .addCase(updateDocumentVisibility.pending, (state) => {
        state.error = null;
      })
      .addCase(updateDocumentVisibility.fulfilled, (state, action) => {
        const updated = action.payload;
        // Update in recentFiles
        state.recentFiles = state.recentFiles.map((f) =>
          f.id === updated.id ? updated : f,
        );
        // Update in publicFiles
        if (updated.visibility === "PUBLIC") {
          const exists = state.publicFiles.find((f) => f.id === updated.id);
          if (exists) {
            state.publicFiles = state.publicFiles.map((f) =>
              f.id === updated.id ? updated : f,
            );
          } else {
            state.publicFiles = [updated, ...state.publicFiles];
          }
        } else {
          // Remove from public if visibility changed to PRIVATE
          state.publicFiles = state.publicFiles.filter(
            (f) => f.id !== updated.id,
          );
        }
      })
      .addCase(updateDocumentVisibility.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default documentSlice.reducer;
export const { clearDocumentError, setSelectedFile, clearSelectedFile } =
  documentSlice.actions;
