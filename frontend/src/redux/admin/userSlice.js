import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchUsers = createAsyncThunk(
  "adminUser/fetchUsers",
  async (status, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("jwt");

      let url = "http://localhost:8080/api/admin/users/all";

      if (status) {
        url += `?status=${status}`;
      }

      const { data } = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Fetched users successfully", data);

      return data;
    } catch (err) {
      console.log("admin users: ", err);
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

export const createUser = createAsyncThunk(
  "adminUser/createUser",
  async (userData, { rejectWithValue }) => {
    console.log("Creating user with data:", userData);

    try {
      const token = localStorage.getItem("jwt");
      const { data } = await axios.post(
        "http://localhost:8080/api/admin/users",
        userData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log("Created user successfully", data);

      return data;
    } catch (err) {
      console.log("admin users: ", err);
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

export const deleteUser = createAsyncThunk(
  "adminUser/deleteUser",
  async (id, { rejectWithValue }) => {
    console.log("Deleting user with id:", id);

    try {
      const token = localStorage.getItem("jwt");
      const { data } = await axios.delete(
        `http://localhost:8080/api/admin/users/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log("Deleted user successfully", data);

      return id;
    } catch (err) {
      console.log("admin users: ", err);
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

export const searchUsers = createAsyncThunk(
  "adminUser/searchUsers",
  async (keyword, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("jwt");

      const { data } = await axios.get(
        `http://localhost:8080/api/admin/users/search?keyword=${keyword}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

const initialState = {
  users: [],
  loading: false,
  error: null,

  createUserLoading: false,

  deletedUserId: null,

  searchLoading: false,
};

const userSlice = createSlice({
  name: "adminUser",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create User
      .addCase(createUser.pending, (state) => {
        state.createUserLoading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.createUserLoading = false;
        state.users = [action.payload, ...state.users];
      })
      .addCase(createUser.rejected, (state, action) => {
        state.createUserLoading = false;
        state.error = action.payload;
      })

      // Delete User
      .addCase(deleteUser.pending, (state, action) => {
        state.deletedUserId = action.meta.arg;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.deletedUserId = null;
        state.users = state.users.filter((user) => user.id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.deletedUserId = null;
        state.error = action.payload;
      })

      // Search Users
      .addCase(searchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(searchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default userSlice.reducer;
