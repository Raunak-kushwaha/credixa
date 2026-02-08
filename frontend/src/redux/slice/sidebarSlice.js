import { createSlice } from "@reduxjs/toolkit";

export const SidebarSlice = createSlice({
  name: "SidebarSlice",
  initialState: {
    isToggled: false,
  },
  reducers: {
    setIsToggled(state, action) {
      state.isToggled = !state.isToggled;
    },
  },
});

export const { setIsToggled } = SidebarSlice.actions;
export const SidebarSlicePath = (state) => state.SidebarSlice.isToggled