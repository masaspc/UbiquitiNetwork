'use client';

import { useConfigStore } from '@/store/useConfigStore';
import { formatPrice } from '@/lib/utils';
import { getProductById } from '@/data/products';

export default function SavedConfigs() {
  const { savedConfigs, loadConfig, deleteConfig } = useConfigStore();

  if (savedConfigs.length === 0) return null;

  const getConfigTotal = (items: { productId: string; quantity: number }[]) => {
    return items.reduce((sum, item) => {
      const product = getProductById(item.productId);
      return sum + (product?.price || 0) * item.quantity;
    }, 0);
  };

  return (
    <div className="mb-6">
      <h3 className="text-sm font-semibold text-white mb-3">保存済み構成</h3>
      <div className="space-y-2">
        {savedConfigs.map(config => (
          <div
            key={config.id}
            className="bg-white/5 rounded-lg p-3 flex items-center justify-between group"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white truncate">{config.name}</p>
              <p className="text-xs text-gray-500">
                {config.items.length}製品 • {formatPrice(getConfigTotal(config.items))}
              </p>
            </div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => loadConfig(config.id)}
                className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/30"
              >
                読込
              </button>
              <button
                onClick={() => deleteConfig(config.id)}
                className="text-xs px-2 py-1 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30"
              >
                削除
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
