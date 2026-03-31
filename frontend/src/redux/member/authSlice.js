import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isAuthenticated: false,
    jwt: "",
  },
  reducers: {
    setAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload;
    },
    setJwt: (state, action) => {
      state.jwt = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.jwt = "";
      localStorage.removeItem("jwt");
    },
  },
});

export default authSlice.reducer;
export const { setAuthenticated, setJwt, logout } = authSlice.actions;
