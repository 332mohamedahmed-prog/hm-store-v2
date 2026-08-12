"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { getWishlist, removeFromWishlist, type WishlistItem } from "@/lib/wishlist";
import { addToCart } from "@/lib/cart";
import { useCart } from "@/components/CartProvider";

export default function WishlistPage() {
  const { refresh } = useCart();
  const [items, setItems] = useState<WishlistItem[]>([]);

  useEffect(() => {
    setItems(getWishlist());
  }, []);

  const handleRemove = (productId: string) => {
    const updated = removeFromWishlist(productId);
    setItems([...updated]);
  };

  const handleAddToCart = (item: WishlistItem) => {
    addToCart({
      productId: item.productId,
      name: item.name,
      slug: item.slug,
      price: item.price,
      comparePrice: null,
      image: item.image,
      size: "",
      color: "",
    }, 1);
    refresh();
  };

  return (
    <div>
      <h2 className="font-heading text-xl text-cream mb-6">المفضلة</h2>

      {items.length === 0 ? (
        <div className="text-center py-16 bg-near-black/50 border border-warm-gold/10 rounded-lg">
          <Heart className="h-12 w-12 text-warm-gold/30 mx-auto mb-3" />
          <p className="font-body text-sm text-cream/40 mb-4">المفضلة فارغة</p>
          <Link href="/products" className="font-body text-sm text-warm-gold hover:text-gold-light transition-colors">
            تصفحي المنتجات
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {items.map(item => (
            <div key={item.productId} className="bg-near-black/50 border border-warm-gold/10 rounded-lg p-4 flex gap-4">
              <Link href={`/products/${item.slug}`} className="shrink-0">
                <div className="w-20 h-24 rounded overflow-hidden bg-near-black/5">
                  <img src={item.image || "/images/placeholder-product.svg"} alt={item.name} className="w-full h-full object-cover" />
                </div>
              </Link>
              <div className="flex-1 min-w-0">
                <Link href={`/products/${item.slug}`}>
                  <h3 className="font-heading text-base text-cream hover:text-warm-gold transition-colors line-clamp-1">{item.name}</h3>
                </Link>
                <p className="font-body text-sm font-medium text-warm-gold mt-1">{item.price} ج.م</p>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="flex items-center gap-1 bg-warm-gold text-near-black px-3 py-1.5 font-body text-xs font-medium hover:bg-gold-light transition-colors rounded"
                  >
                    <ShoppingBag className="h-3 w-3" /> أضف للسلة
                  </button>
                  <button
                    onClick={() => handleRemove(item.productId)}
                    className="flex items-center gap-1 border border-warm-gold/20 text-cream/40 px-3 py-1.5 font-body text-xs hover:text-red-500 hover:border-red-200 transition-colors rounded"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
