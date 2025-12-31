'use client';

import { useState } from 'react';
import { useFilteredProducts, useConfigStore } from '@/store/useConfigStore';
import ProductCard from './ProductCard';
import FilterPanel from './FilterPanel';
import { ProductCategory } from '@/types';
import { getCategoryLabel } from '@/lib/utils';

const categories: { id: ProductCategory | 'all'; label: string; icon: string }[] = [
  { id: 'all', label: 'すべて', icon: '📦' },
  { id: 'gateway', label: 'Gateway', icon: '🌐' },
  { id: 'switch', label: 'Switch', icon: '🔀' },
  { id: 'wifi', label: 'WiFi AP', icon: '📶' },
  { id: 'camera', label: 'Camera', icon: '📷' },
  { id: 'nvr', label: 'NVR', icon: '💾' },
  { id: 'accessory', label: 'Accessories', icon: '🔌' },
];

export default function ProductCatalog() {
  const filteredProducts = useFilteredProducts();
  const { filters, setFilters, resetFilters } = useConfigStore();
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const activeCategory = filters.categories.length === 1 ? filters.categories[0] : 'all';

  const handleCategoryClick = (categoryId: ProductCategory | 'all') => {
    if (categoryId === 'all') {
      setFilters({ categories: [], subcategories: [] });
    } else {
      setFilters({ categories: [categoryId], subcategories: [] });
    }
  };

  return (
    <div>
      {/* Category Tabs */}
      <div className="mb-6 overflow-x-auto">
        <div className="flex gap-2 min-w-max pb-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                (cat.id === 'all' && filters.categories.length === 0) ||
                (cat.id !== 'all' && filters.categories.includes(cat.id as ProductCategory))
                  ? 'bg-blue-500 text-white'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-4 flex gap-2">
        <button
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg text-sm text-gray-300 hover:bg-white/10"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          フィルター
        </button>
        {(filters.searchQuery || filters.fanless || filters.poeSupply || filters.layer3 || filters.wifi7 || filters.inStockOnly) && (
          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg text-sm hover:bg-red-500/30"
          >
            リセット
          </button>
        )}
      </div>

      {/* Mobile Filters Panel */}
      {showMobileFilters && (
        <div className="lg:hidden mb-4 bg-[#0f1419] rounded-xl border border-white/10 p-4">
          <FilterPanel />
        </div>
      )}

      <div className="flex gap-6">
        {/* Filter Sidebar (Desktop) */}
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
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
