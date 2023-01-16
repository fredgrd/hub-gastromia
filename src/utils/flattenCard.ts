import { CartItemSnapshot } from "../models/cart-snapshot";

const flattenCart = (cart: CartItemSnapshot[]): CartItemSnapshot[] => {
  const flat: CartItemSnapshot[] = cart.flatMap((snapshot) =>
    Array(snapshot.quantity).fill(snapshot)
  );

  return flat;
};

export default flattenCart;
