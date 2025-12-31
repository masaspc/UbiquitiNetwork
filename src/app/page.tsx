'use client';

import { useEffect } from 'react';
import Header from '@/components/layout/Header';
import ProductCatalog from '@/components/products/ProductCatalog';
import ConfigPanel from '@/components/config/ConfigPanel';
import ComparePanel from '@/components/compare/ComparePanel';
import Templates from '@/components/config/Templates';
import SavedConfigs from '@/components/config/SavedConfigs';
import { useConfigStore } from '@/store/useConfigStore';

export default function Home() {
  const { loadFromUrl, compareProducts } = useConfigStore();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = window.location.search.slice(1);
      if (params) {
        loadFromUrl(params);
        window.history.replaceState({}, '', window.location.pathname);
      }
    }
  }, [loadFromUrl]);

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

          {/* Right Sidebar - Configuration Panel */}
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
      <footer className="border-t border-white/10 mt-12 py-6">
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

      {/* Mobile Config Button */}
      <div className="xl:hidden fixed bottom-4 right-4 z-30">
        <MobileConfigButton />
      </div>
    </div>
  );
}

function MobileConfigButton() {
  const { currentConfig } = useConfigStore();
  const itemCount = currentConfig.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <button
      onClick={() => {
        const panel = document.getElementById('mobile-config-panel');
        if (panel) panel.classList.toggle('translate-x-full');
      }}
      className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-4 shadow-lg flex items-center gap-2"
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
      {itemCount > 0 && (
        <span className="bg-white text-blue-500 text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center">
          {itemCount}
        </span>
      )}
    </button>
  );
}
