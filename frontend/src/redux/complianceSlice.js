import { createSlice } from '@reduxjs/toolkit';

const complianceSlice = createSlice({
  name: 'compliance',
  initialState: { kyc: false, documents: 0 },
  reducers: {
    setCompliance(state, action) {
      state.kyc = action.payload.kyc;
      state.documents = action.payload.documents;
    },
  },
});

export const { setCompliance } = complianceSlice.actions;
export default complianceSlice.reducer;
