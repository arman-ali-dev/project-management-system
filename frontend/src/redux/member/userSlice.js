import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchUserProfile = createAsyncThunk(
  "users/fetchUser",
  async (_, { rejectWithValue }) => {
    try {
      console.log("fetching2....");
      const token = localStorage.getItem("jwt");
      const { data } = await axios.get(
        "https://apislack.a2groups.org/api/users/profile",
        { headers: { Authorization: `Bearer ${token}` } },
      );
      console.log("User Data: ", data);
      return data;
    } catch (error) {
      console.error(error);
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  },
);

export const editProfile = createAsyncThunk(
  "user/editProfile",
  async (profileData, { rejectWithValue }) => {
    console.log(profileData);
    try {
      const token = localStorage.getItem("jwt");
      const { data } = await axios.put(
        "https://apislack.a2groups.org/api/users/update",
        profileData,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      return data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data);
    }
  },
);

export const fetchAllUsers = createAsyncThunk(
  "users/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("jwt");
      const { data } = await axios.get("https://apislack.a2groups.org/api/users/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Fetched users successfully", data);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  },
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    users: [], // ← saare users
    loading: false,
    error: null,
    loadingUpdate: false,
  },

  extraReducers: (builder) => {
    builder
      // FETCH USER PROFILE
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // EDIT PROFILE
      .addCase(editProfile.pending, (state) => {
        state.loadingUpdate = true;
      })
      .addCase(editProfile.fulfilled, (state, action) => {
        state.loadingUpdate = false;
        state.user = action.payload;
      })
      .addCase(editProfile.rejected, (state) => {
        state.loadingUpdate = false;
      })

      // FETCH ALL USERS
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default userSlice.reducer;
