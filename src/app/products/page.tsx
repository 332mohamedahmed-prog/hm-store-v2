import { Suspense } from "react";

function ProductsLoading() {
  return (
    <div className="min-h-screen bg-near-black/40 flex items-center justify-center">
      <div className="animate-shimmer w-48 h-8 rounded bg-near-black/50" />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductsLoading />}>
      <ProductsContent />
    </Suspense>
  );
}

// ─── Actual content ──────────────────────────────────────────────
import ProductsContent from "@/components/products/ProductsContent";
