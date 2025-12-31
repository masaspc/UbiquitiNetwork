'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/layout/Header';
import ProductCatalog from '@/components/products/ProductCatalog';
import ConfigPanel from '@/components/config/ConfigPanel';
import ComparePanel from '@/components/compare/ComparePanel';
import Templates from '@/components/config/Templates';
import SavedConfigs from '@/components/config/SavedConfigs';
import { useConfigStore } from '@/store/useConfigStore';
import { formatPrice, calculateConfigSummary } from '@/lib/utils';

export default function Home() {
  const { loadFromUrl, compareProducts, currentConfig } = useConfigStore();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = window.location.search.slice(1);
      if (params) {
        loadFromUrl(params);
        window.history.replaceState({}, '', window.location.pathname);
      }
    }
  }, [loadFromUrl]);

  const itemCount = currentConfig.items.reduce((sum, item) => sum + item.quantity, 0);
  const summary = calculateConfigSummary(currentConfig.items);

  return (
    <div className="min-h-screen bg-[#0a0e14]">
      <Header />

      <main className="max-w-[1800px] mx-auto px-4 py-6">
        <Templates />

        <div className="flex gap-6">
          {/* Main Content - Product Catalog */}
          <div className="flex-1 min-w-0">
            <ProductCatalog />
          </div>

          {/* Right Sidebar - Configuration Panel (Desktop) */}
          <aside className="w-80 flex-shrink-0 hidden xl:block">
            <div className="sticky top-20">
              <SavedConfigs />
              <ConfigPanel />
            </div>
          </aside>
        </div>
      </main>

      {/* Compare Panel */}
      {compareProducts.length > 0 && <ComparePanel />}

      {/* Footer */}
      <footer className="border-t border-white/10 mt-12 py-6 pb-24 xl:pb-6">
        <div className="max-w-[1800px] mx-auto px-4 text-center text-sm text-gray-500">
          <p className="mb-2">
            ※ 表示価格・在庫状況は参考情報です。最新情報は
            <a href="https://jp.store.ui.com/jp/ja" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline mx-1">
              日本公式ストア
            </a>
            でご確認ください。
          </p>
          <p className="text-xs text-gray-600">
            This is an unofficial tool. Ubiquiti and UniFi are trademarks of Ubiquiti Inc.
          </p>
        </div>
      </footer>

      {/* Mobile/Tablet Cart Button - Fixed at bottom */}
      <div className="xl:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0f1419] border-t border-white/10 p-3">
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-xl p-4 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-white text-blue-500 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </div>
            <span className="font-medium">構成リストを見る</span>
          </div>
          <span className="text-lg font-bold">{formatPrice(summary.totalPrice)}</span>
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {isDrawerOpen && (
        <div
          className="xl:hidden fixed inset-0 bg-black/60 z-50"
          onClick={() => setIsDrawerOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={`xl:hidden fixed top-0 right-0 h-full w-full max-w-md bg-[#0a0e14] z-50 transform transition-transform duration-300 ease-in-out ${
          isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Drawer Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <h2 className="text-lg font-semibold text-white">構成リスト</h2>
            <button
              onClick={() => setIsDrawerOpen(false)}
              className="p-2 text-gray-400 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4">
              <SavedConfigs />
            </div>
            <ConfigPanel />
          </div>
        </div>
      </div>
    </div>
  );
}
