import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: { user: null, role: '', token: '' },
  reducers: {
    setUser(state, action) {
      state.user = action.payload.user;
      state.role = action.payload.role;
      state.token = action.payload.token;
    },
    logout(state) {
      state.user = null;
      state.role = '';
      state.token = '';
    },
  },
});

export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;
