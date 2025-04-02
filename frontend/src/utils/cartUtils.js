export const addDecimals = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2);
  };

  export const updateCart = (state) => {
    // Calculate items price
    state.itemsPrice = addDecimals(
        state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
      );

      // Calculate shipping price (if order is over $100 then free, else $10shipping) (changed here) from 10 to 1
      state.shippingPrice = addDecimals(state.itemsPrice > 100 ? 0 : 1);

      // Calculate tax price (15% tax)(changed here) from 0.15 to 0.01
      state.taxPrice = addDecimals(Number((0.01 * state.itemsPrice).toFixed(2)));

      // Calculate total price
      state.totalPrice = addDecimals(
        Number(state.itemsPrice) +
          Number(state.shippingPrice) +
          Number(state.taxPrice)
      );

      // Save cart to localStorage
      localStorage.setItem("cart", JSON.stringify(state));
      return state
  }