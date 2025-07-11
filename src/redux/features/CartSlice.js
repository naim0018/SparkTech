import { createSlice } from '@reduxjs/toolkit';

// Load cart items from localStorage if they exist
const loadCartItems = () => {
  try {
    const savedCart = localStorage.getItem('cartItems');
    return savedCart ? JSON.parse(savedCart) : [];
  } catch (error) {
    console.error('Error loading cart from localStorage:', error);
    return [];
  }
};

const initialState = {
  cartItems: loadCartItems(),
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
    
      const { id, name, price:basePrice, image, quantity, selectedVariants } = action.payload;
      // Create a unique key that includes all variants
      const variantKey = selectedVariants?.length > 0
        ? `${id}-${selectedVariants.map(v => `${v.group}-${v.value}`).join('-')}`
        : id;
      
      const existingItemIndex = state.cartItems.findIndex(
        item => item.itemKey === variantKey
      );

      // Calculate the price based on selected variants
      let price = basePrice;
      
      if (selectedVariants?.length > 0) {
        selectedVariants.forEach(variant => {
          const variantItem = variant.items.find(item => item.value === variant.value);
          if (variantItem && variantItem.price) {
            price += variantItem.price;
          }
        });
      }
      
      if (existingItemIndex >= 0) {
        state.cartItems[existingItemIndex].quantity += quantity;
      } else {
        state.cartItems.push({
          id,
          itemKey: variantKey,
          name,
          price : price,
          image,
          quantity,
          selectedVariants
        });
      }
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },
    updateQuantity: (state, action) => {
      const { itemKey, quantity } = action.payload;
      const item = state.cartItems.find(item => item.itemKey === itemKey);
      if (item) {
        item.quantity = quantity;
        localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
      }
    },
    removeFromCart: (state, action) => {
      const { itemKey } = action.payload;
      state.cartItems = state.cartItems.filter(item => item.itemKey !== itemKey);
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },
    incrementQuantity: (state, action) => {
      const { itemKey } = action.payload;
      const item = state.cartItems.find(item => item.itemKey === itemKey);
      if (item) {
        item.quantity++;
        localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
      }
    },
    decrementQuantity: (state, action) => {
      const { itemKey } = action.payload;
      const item = state.cartItems.find(item => item.itemKey === itemKey);
      if (item && item.quantity > 1) {
        item.quantity--;
        localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
      }
    },
    clearCart: (state) => {
      state.cartItems = [];
      localStorage.removeItem('cartItems');
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  incrementQuantity,
  decrementQuantity,
  clearCart,
  updateQuantity,
} = cartSlice.actions;

export default cartSlice.reducer;
