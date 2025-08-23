import { createSlice } from '@reduxjs/toolkit';

const policySlice = createSlice({
  name: 'policy',
  initialState: { list: [] },
  reducers: {
    setPolicies(state, action) {
      state.list = action.payload;
    },
    addPolicy(state, action) {
      state.list.push(action.payload);
    },
  },
});

export const { setPolicies, addPolicy } = policySlice.actions;
export default policySlice.reducer;
