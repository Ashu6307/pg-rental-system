import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchTerms = createAsyncThunk('terms/fetchTerms', async () => {
  const res = await axios.get('/api/terms');
  return res.data;
});

export const updateTerms = createAsyncThunk('terms/updateTerms', async (content) => {
  const res = await axios.put('/api/terms', { content });
  return res.data;
});

const termsSlice = createSlice({
  name: 'terms',
  initialState: {
    content: '',
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTerms.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTerms.fulfilled, (state, action) => {
        state.content = action.payload.content;
        state.status = 'succeeded';
      })
      .addCase(fetchTerms.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(updateTerms.fulfilled, (state, action) => {
        state.content = action.payload.content;
        state.status = 'succeeded';
      });
  },
});

export default termsSlice.reducer;
