import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getOrderByNumberApi, orderBurgerApi } from '@api';

import { RootState } from '../store';
import { clearConstructor } from './constructorSlice';

import { TOrder } from '../../utils/types';

type TOrderState = {
  orderRequest: boolean;
  orderModalData: TOrder | null;
  currentOrder: TOrder | null;
  error: string | null;
};

const initialState: TOrderState = {
  orderRequest: false,
  orderModalData: null,
  currentOrder: null,
  error: null
};

export const createOrder = createAsyncThunk<TOrder, void, { state: RootState }>(
  'order/create',
  async (_, { getState, dispatch }) => {
    const { bun, ingredients } = getState().burgerConstructor.constructorItems;

    if (!bun) {
      throw new Error('Булка отсутствует');
    }

    const ingredientIds = [
      bun._id,
      ...ingredients.map((item) => item._id),
      bun._id
    ];

    const response = await orderBurgerApi(ingredientIds);

    dispatch(clearConstructor());

    return response.order;
  }
);

export const getOrderByNumber = createAsyncThunk(
  'order/getByNumber',
  async (number: number, { rejectWithValue }) => {
    try {
      const response = await getOrderByNumberApi(number);

      if (!response.orders.length) {
        return rejectWithValue('Заказ не найден');
      }

      return response.orders[0];
    } catch {
      return rejectWithValue('Заказ не найден');
    }
  }
);

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrderModal(state) {
      state.orderModalData = null;
    },

    clearCurrentOrder(state) {
      state.currentOrder = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // createOrder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.error.message || 'Ошибка создания заказа';
      })

      // getOrderByNumber
      .addCase(getOrderByNumber.pending, (state) => {
        state.error = null;
        state.currentOrder = null;
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.currentOrder = action.payload;
      })
      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.currentOrder = null;
        state.error =
          (action.payload as string) ||
          action.error.message ||
          'Заказ не найден';
      });
  }
});

export const { clearOrderModal, clearCurrentOrder } = orderSlice.actions;

export default orderSlice.reducer;
