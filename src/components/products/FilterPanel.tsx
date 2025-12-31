'use client';

import { useConfigStore } from '@/store/useConfigStore';
import { getSubcategoryLabel } from '@/lib/utils';

const switchSubcats = ['aggregation', 'enterprise', 'pro-xg', 'pro-max', 'professional', 'standard', 'utility'];
const wifiSubcats = ['flagship', 'in-wall', 'outdoor'];

export default function FilterPanel() {
  const { filters, setFilters, resetFilters } = useConfigStore();

  const toggleSubcategory = (sub: string) => {
    const current = filters.subcategories;
    const updated = current.includes(sub)
      ? current.filter(s => s !== sub)
      : [...current, sub];
    setFilters({ subcategories: updated });
  };

  const hasActiveFilters = filters.searchQuery || filters.fanless || filters.poeSupply ||
    filters.layer3 || filters.wifi7 || filters.inStockOnly || filters.etherlighting ||
    filters.wifi6GHz || filters.poePowered || filters.subcategories.length > 0;

  return (
    <div className="space-y-5">
      {/* Search */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-semibold text-white">絞り込み</h3>
          {hasActiveFilters && (
            <button onClick={resetFilters} className="text-xs text-blue-400 hover:text-blue-300">
              リセット
            </button>
          )}
        </div>
        <input
          type="search"
          placeholder="製品名・型番で検索..."
          value={filters.searchQuery}
          onChange={(e) => setFilters({ searchQuery: e.target.value })}
          className="w-full"
        />
      </div>

      {/* Switch Subcategories */}
      {filters.categories.includes('switch') && (
        <div>
          <h4 className="text-xs font-medium text-gray-400 mb-2">スイッチタイプ</h4>
          <div className="flex flex-wrap gap-1">
            {switchSubcats.map(sub => (
              <button
                key={sub}
                onClick={() => toggleSubcategory(sub)}
                className={`text-xs px-2 py-1 rounded-md transition-colors ${
                  filters.subcategories.includes(sub)
                    ? 'bg-blue-500 text-white'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                {getSubcategoryLabel(sub)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* WiFi Subcategories */}
      {filters.categories.includes('wifi') && (
        <div>
          <h4 className="text-xs font-medium text-gray-400 mb-2">設置タイプ</h4>
          <div className="flex flex-wrap gap-1">
            {wifiSubcats.map(sub => (
              <button
                key={sub}
                onClick={() => toggleSubcategory(sub)}
                className={`text-xs px-2 py-1 rounded-md transition-colors ${
                  filters.subcategories.includes(sub)
                    ? 'bg-blue-500 text-white'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                {getSubcategoryLabel(sub)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Stock Filter */}
      <div>
        <h4 className="text-xs font-medium text-gray-400 mb-2">在庫</h4>
        <label className="flex items-center gap-2 cursor-pointer py-1">
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={(e) => setFilters({ inStockOnly: e.target.checked })}
          />
          <span className="text-sm text-gray-300">在庫ありのみ表示</span>
        </label>
      </div>

      {/* Switch Specific Filters */}
      {(filters.categories.length === 0 || filters.categories.includes('switch')) && (
        <div>
          <h4 className="text-xs font-medium text-gray-400 mb-2">スイッチ機能</h4>
          <div className="space-y-1">
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
              <span className="text-sm text-gray-300">Layer 3 (L3)</span>
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
      )}

      {/* WiFi Specific Filters */}
      {(filters.categories.length === 0 || filters.categories.includes('wifi')) && (
        <div>
          <h4 className="text-xs font-medium text-gray-400 mb-2">WiFi機能</h4>
          <div className="space-y-1">
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
                checked={filters.wifi6GHz}
                onChange={(e) => setFilters({ wifi6GHz: e.target.checked })}
              />
              <span className="text-sm text-gray-300">6GHz帯対応</span>
            </label>
          </div>
        </div>
      )}

      {/* General Filters */}
      <div>
        <h4 className="text-xs font-medium text-gray-400 mb-2">その他</h4>
        <div className="space-y-1">
          <label className="flex items-center gap-2 cursor-pointer py-1">
            <input
              type="checkbox"
              checked={filters.fanless}
              onChange={(e) => setFilters({ fanless: e.target.checked })}
            />
            <span className="text-sm text-gray-300">ファンレス（静音）</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer py-1">
            <input
              type="checkbox"
              checked={filters.poePowered}
              onChange={(e) => setFilters({ poePowered: e.target.checked })}
            />
            <span className="text-sm text-gray-300">PoE受電対応</span>
          </label>
        </div>
      </div>
    </div>
  );
}
