// ─── Wishlist Utility (localStorage) ─────────────────────────────
// نفس مفهوم السلة — localStorage للزوار، مزامنة مع DB في المرحلة 5.

export interface WishlistItem {
  productId: string;
  name: string;
  slug: string;
  price: string;
  image: string;
}

const WISH_KEY = "hm_wishlist";

export function getWishlist(): WishlistItem[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(WISH_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveWishlist(items: WishlistItem[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(WISH_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("wishlist-updated"));
}

export function addToWishlist(item: WishlistItem): WishlistItem[] {
  const list = getWishlist();
  if (!list.find((w) => w.productId === item.productId)) {
    list.push(item);
    saveWishlist(list);
  }
  return list;
}

export function removeFromWishlist(productId: string): WishlistItem[] {
  const list = getWishlist().filter((w) => w.productId !== productId);
  saveWishlist(list);
  return list;
}

export function isInWishlist(productId: string): boolean {
  return getWishlist().some((w) => w.productId === productId);
}
