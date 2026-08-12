// ─── Cart Utility (localStorage) ────────────────────────────────
// للزوار غير المسجلين، السلة تُخزن في localStorage.
// عند إضافة تسجيل دخول (المرحلة 5)، سيتم مزامنة السلة مع قاعدة البيانات.

export interface CartItem {
  productId: string;
  name: string;
  slug: string;
  price: string;       // EGP string
  comparePrice: string | null;
  image: string;
  size: string;
  color: string;
  quantity: number;
}

const CART_KEY = "hm_cart";

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(CART_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveCart(items: CartItem[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("cart-updated"));
}

export function addToCart(item: Omit<CartItem, "quantity">, quantity: number = 1): CartItem[] {
  const cart = getCart();
  const existingIndex = cart.findIndex(
    (c) => c.productId === item.productId && c.size === item.size && c.color === item.color
  );

  if (existingIndex >= 0) {
    cart[existingIndex].quantity += quantity;
  } else {
    cart.push({ ...item, quantity });
  }

  saveCart(cart);
  return cart;
}

export function updateQuantity(productId: string, size: string, color: string, quantity: number): CartItem[] {
  const cart = getCart();
  const index = cart.findIndex(
    (c) => c.productId === productId && c.size === size && c.color === color
  );
  if (index >= 0) {
    if (quantity <= 0) {
      cart.splice(index, 1);
    } else {
      cart[index].quantity = quantity;
    }
  }
  saveCart(cart);
  return cart;
}

export function removeFromCart(productId: string, size: string, color: string): CartItem[] {
  const cart = getCart().filter(
    (c) => !(c.productId === productId && c.size === size && c.color === color)
  );
  saveCart(cart);
  return cart;
}

export function clearCart(): void {
  saveCart([]);
}

export function getCartTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0);
}

export function getCartCount(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}
