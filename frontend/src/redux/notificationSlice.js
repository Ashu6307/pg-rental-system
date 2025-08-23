import { createSlice } from '@reduxjs/toolkit';

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: { list: [], unread: 0 },
  reducers: {
    setNotifications(state, action) {
      state.list = action.payload.list;
      state.unread = action.payload.unread;
    },
    addNotification(state, action) {
      state.list.unshift(action.payload);
      state.unread += 1;
    },
    markAllRead(state) {
      state.unread = 0;
    },
  },
});

export const { setNotifications, addNotification, markAllRead } = notificationSlice.actions;
export default notificationSlice.reducer;
