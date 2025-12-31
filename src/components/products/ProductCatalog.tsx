'use client';

import { useFilteredProducts } from '@/store/useConfigStore';
import ProductCard from './ProductCard';
import FilterPanel from './FilterPanel';

export default function ProductCatalog() {
  const filteredProducts = useFilteredProducts();

  return (
    <div className="flex gap-6">
      {/* Filter Sidebar */}
      <aside className="w-64 flex-shrink-0 hidden lg:block">
        <div className="sticky top-20 bg-[#0f1419] rounded-xl border border-white/10 p-4">
          <FilterPanel />
        </div>
      </aside>

      {/* Product Grid */}
      <div className="flex-1">
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-gray-400">{filteredProducts.length}件の製品</p>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">条件に一致する製品がありません</p>
            <p className="text-sm text-gray-600 mt-1">フィルターを変更してください</p>
          </div>
        ) : (
          <div className="product-grid">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
