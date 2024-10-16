import { createSlice } from '@reduxjs/toolkit';
import { productApi } from '../api/ProductApi';

const initialState = {
  brands: [],
  categories: [],
  subCategories: [],
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(
      productApi.endpoints.getAllProducts.matchFulfilled,
      (state, { payload }) => {
        if (payload && payload.data) {
          state.brands = [...new Set(payload.data.map(product => product.brand))];
          state.categories = [...new Set(payload.data.map(product => product.category))];
          state.subCategories = [...new Set(payload.data.map(product => product.subCategory))];
        }
      }
    );
  },
});

export const selectBrands = (state) => state.product.brands;
export const selectCategories = (state) => state.product.categories;
export const selectSubCategories = (state) => state.product.subCategories;

export default productSlice.reducer;
