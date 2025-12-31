'use client';

import { useConfigStore } from '@/store/useConfigStore';
import { getProductById } from '@/data/products';
import { formatPrice, calculateConfigSummary } from '@/lib/utils';
import { useState } from 'react';

export default function ConfigPanel() {
  const { currentConfig, updateQuantity, removeProduct, clearConfig, saveConfig, exportConfig } = useConfigStore();
  const [saveName, setSaveName] = useState('');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const summary = calculateConfigSummary(currentConfig.items);

  const handleSave = () => {
    if (saveName.trim()) {
      saveConfig(saveName.trim());
      setSaveName('');
      setShowSaveModal(false);
    }
  };

  const handleExport = () => {
    const json = exportConfig();
    navigator.clipboard.writeText(json);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    const url = useConfigStore.getState().getShareableUrl();
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#0f1419] rounded-xl border border-white/10 h-full flex flex-col">
      <div className="p-4 border-b border-white/10">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-white">構成リスト</h2>
          <span className="text-sm text-gray-400">{currentConfig.items.length}製品</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {currentConfig.items.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm">製品を追加してください</p>
            <p className="text-xs mt-1">カタログから製品カードの「追加」ボタンをクリック</p>
          </div>
        ) : (
          currentConfig.items.map(({ productId, quantity }) => {
            const product = getProductById(productId);
            if (!product) return null;

            return (
              <div key={productId} className="bg-white/5 rounded-lg p-3">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white font-medium truncate">{product.name}</p>
                    <p className="text-xs text-gray-500">{product.model}</p>
                  </div>
                  <button
                    onClick={() => removeProduct(productId)}
                    className="text-gray-500 hover:text-red-400 ml-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(productId, quantity - 1)}
                      className="w-6 h-6 rounded bg-white/10 text-white text-sm hover:bg-white/20"
                    >
                      -
                    </button>
                    <span className="text-sm text-white w-6 text-center">{quantity}</span>
                    <button
                      onClick={() => updateQuantity(productId, quantity + 1)}
                      className="w-6 h-6 rounded bg-white/10 text-white text-sm hover:bg-white/20"
                    >
                      +
                    </button>
                  </div>
                  <p className="text-sm font-semibold text-white">
                    {formatPrice(product.price * quantity)}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Summary */}
      <div className="border-t border-white/10 p-4 space-y-3">
        {summary.warnings.length > 0 && (
          <div className="space-y-2">
            {summary.warnings.map((warning, i) => (
              <div
                key={i}
                className={`text-xs p-2 rounded ${
                  warning.type === 'error' ? 'bg-red-500/20 text-red-400' :
                  warning.type === 'warning' ? 'bg-amber-500/20 text-amber-400' :
                  'bg-blue-500/20 text-blue-400'
                }`}
              >
                {warning.message}
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-white/5 rounded p-2">
            <p className="text-gray-500">PoE供給</p>
            <p className="text-white font-medium">{summary.totalPoESupply}W</p>
          </div>
          <div className="bg-white/5 rounded p-2">
            <p className="text-gray-500">PoE消費(推定)</p>
            <p className="text-white font-medium">{summary.totalPoEConsumption}W</p>
          </div>
          <div className="bg-white/5 rounded p-2">
            <p className="text-gray-500">10Gポート</p>
            <p className="text-white font-medium">{summary.total10GPorts}</p>
          </div>
          <div className="bg-white/5 rounded p-2">
            <p className="text-gray-500">WiFiカバレッジ</p>
            <p className="text-white font-medium">{summary.totalWiFiCoverage}㎡</p>
          </div>
        </div>

        <div className="flex justify-between items-center pt-2 border-t border-white/10">
          <span className="text-gray-400">合計</span>
          <span className="text-2xl font-bold text-white">{formatPrice(summary.totalPrice)}</span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowSaveModal(true)}
            disabled={currentConfig.items.length === 0}
            className="flex-1 py-2 px-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white text-sm rounded-lg transition-colors"
          >
            保存
          </button>
          <button
            onClick={handleShare}
            disabled={currentConfig.items.length === 0}
            className="py-2 px-3 bg-white/10 hover:bg-white/20 disabled:bg-gray-600 disabled:cursor-not-allowed text-white text-sm rounded-lg transition-colors"
            title="共有URLをコピー"
          >
            {copied ? '✓' : '共有'}
          </button>
          <button
            onClick={clearConfig}
            disabled={currentConfig.items.length === 0}
            className="py-2 px-3 bg-white/10 hover:bg-red-500/50 disabled:bg-gray-600 disabled:cursor-not-allowed text-white text-sm rounded-lg transition-colors"
            title="クリア"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Save Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowSaveModal(false)}>
          <div className="bg-[#0f1419] border border-white/10 rounded-xl p-6 w-80" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-white mb-4">構成を保存</h3>
            <input
              type="text"
              placeholder="構成名を入力..."
              value={saveName}
              onChange={e => setSaveName(e.target.value)}
              className="w-full mb-4"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="flex-1 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg"
              >
                保存
              </button>
              <button
                onClick={() => setShowSaveModal(false)}
                className="flex-1 py-2 bg-white/10 hover:bg-white/20 text-white text-sm rounded-lg"
              >
                キャンセル
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
