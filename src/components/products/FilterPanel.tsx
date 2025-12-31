'use client';

import { useConfigStore } from '@/store/useConfigStore';
import { getCategoryLabel, getSubcategoryLabel } from '@/lib/utils';
import { ProductCategory } from '@/types';

const categories: ProductCategory[] = ['gateway', 'switch', 'wifi', 'camera', 'nvr', 'accessory'];
const switchSubcats = ['aggregation', 'enterprise', 'pro-xg', 'pro-max', 'professional', 'standard', 'utility'];

export default function FilterPanel() {
  const { filters, setFilters, resetFilters } = useConfigStore();

  const toggleCategory = (cat: ProductCategory) => {
    const current = filters.categories;
    const updated = current.includes(cat)
      ? current.filter(c => c !== cat)
      : [...current, cat];
    setFilters({ categories: updated });
  };

  const toggleSubcategory = (sub: string) => {
    const current = filters.subcategories;
    const updated = current.includes(sub)
      ? current.filter(s => s !== sub)
      : [...current, sub];
    setFilters({ subcategories: updated });
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-semibold text-white">フィルター</h3>
          <button onClick={resetFilters} className="text-xs text-blue-400 hover:text-blue-300">
            リセット
          </button>
        </div>

        <input
          type="search"
          placeholder="製品を検索..."
          value={filters.searchQuery}
          onChange={(e) => setFilters({ searchQuery: e.target.value })}
          className="w-full mb-4"
        />
      </div>

      <div>
        <h4 className="text-xs font-medium text-gray-400 mb-2">カテゴリ</h4>
        <div className="space-y-1">
          {categories.map(cat => (
            <label key={cat} className="flex items-center gap-2 cursor-pointer py-1">
              <input
                type="checkbox"
                checked={filters.categories.includes(cat)}
                onChange={() => toggleCategory(cat)}
              />
              <span className="text-sm text-gray-300">{getCategoryLabel(cat)}</span>
            </label>
          ))}
        </div>
      </div>

      {filters.categories.includes('switch') && (
        <div>
          <h4 className="text-xs font-medium text-gray-400 mb-2">スイッチタイプ</h4>
          <div className="space-y-1">
            {switchSubcats.map(sub => (
              <label key={sub} className="flex items-center gap-2 cursor-pointer py-1">
                <input
                  type="checkbox"
                  checked={filters.subcategories.includes(sub)}
                  onChange={() => toggleSubcategory(sub)}
                />
                <span className="text-sm text-gray-300">{getSubcategoryLabel(sub)}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      <div>
        <h4 className="text-xs font-medium text-gray-400 mb-2">機能</h4>
        <div className="space-y-1">
          <label className="flex items-center gap-2 cursor-pointer py-1">
            <input
              type="checkbox"
              checked={filters.inStockOnly}
              onChange={(e) => setFilters({ inStockOnly: e.target.checked })}
            />
            <span className="text-sm text-gray-300">在庫ありのみ</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer py-1">
            <input
              type="checkbox"
              checked={filters.fanless}
              onChange={(e) => setFilters({ fanless: e.target.checked })}
            />
            <span className="text-sm text-gray-300">ファンレス</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer py-1">
            <input
              type="checkbox"
              checked={filters.poeSupply}
              onChange={(e) => setFilters({ poeSupply: e.target.checked })}
            />
            <span className="text-sm text-gray-300">PoE供給対応</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer py-1">
            <input
              type="checkbox"
              checked={filters.layer3}
              onChange={(e) => setFilters({ layer3: e.target.checked })}
            />
            <span className="text-sm text-gray-300">Layer 3対応</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer py-1">
            <input
              type="checkbox"
              checked={filters.wifi7}
              onChange={(e) => setFilters({ wifi7: e.target.checked })}
            />
            <span className="text-sm text-gray-300">WiFi 7対応</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer py-1">
            <input
              type="checkbox"
              checked={filters.etherlighting}
              onChange={(e) => setFilters({ etherlighting: e.target.checked })}
            />
            <span className="text-sm text-gray-300">Etherlighting</span>
          </label>
        </div>
      </div>
    </div>
  );
}
