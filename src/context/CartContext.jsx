import { createContext, useContext, useState, useCallback } from "react";

import {
  getCart,
  addToCart as addToCartApi,
  removeFromCart as removeFromCartApi,
  removeOneFromCart as removeOneFromCartApi,
  addOneToCart as addOneToCartApi,
} from "../services/cartService";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const refreshCart = useCallback(async (silent = false) => {
    if (silent) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const res = await getCart();
      setCart(res.data);
    } finally {
      if (silent) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  }, []);

  const addItem = async (productId, quantity) => {
    const res = await addToCartApi(productId, quantity);
    setCart(res.data);
  };

  const removeItem = async (productId) => {
    await removeFromCartApi(productId);
    await refreshCart(true);
  };

  const removeOneFromCart = async (productId) => {
    await removeOneFromCartApi(productId);
    await refreshCart(true);
  };

  const addOneToCart = async (productId) => {
    await addOneToCartApi(productId);
    await refreshCart(true);
  };

  const itemCount =
    cart.items?.reduce((sum, i) => sum + i.quantity, 0) || 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        refreshing,
        refreshCart,
        addItem,
        removeItem,
        removeOneFromCart,
        addOneToCart,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);