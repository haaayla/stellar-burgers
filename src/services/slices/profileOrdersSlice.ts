import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getOrdersApi } from '@api';
import { TOrder } from '@utils-types';

type TProfileOrdersState = {
  orders: TOrder[];
  isLoading: boolean;
  error: string | null;
};

const initialState: TProfileOrdersState = {
  orders: [],
  isLoading: false,
  error: null
};

export const getProfileOrders = createAsyncThunk<TOrder[]>(
  'profileOrders/getAll',
  getOrdersApi
);

export const profileOrdersSlice = createSlice({
  name: 'profileOrders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getProfileOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getProfileOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
        state.error = null;
      })
      .addCase(getProfileOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.orders = [];
        state.error =
          action.error.message || 'Ошибка получения истории заказов';
      });
  }
});

export default profileOrdersSlice.reducer;
