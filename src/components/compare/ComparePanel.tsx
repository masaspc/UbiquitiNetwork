'use client';

import { useConfigStore } from '@/store/useConfigStore';
import { getProductById } from '@/data/products';
import { formatPrice, getCategoryLabel } from '@/lib/utils';
import { SwitchSpecs, WiFiSpecs, GatewaySpecs } from '@/types';

export default function ComparePanel() {
  const { compareProducts, removeFromCompare, clearCompare, addProduct } = useConfigStore();

  if (compareProducts.length === 0) return null;

  const products = compareProducts.map(id => getProductById(id)).filter(Boolean);

  const getSpecValue = (product: typeof products[0], key: string): string => {
    if (!product) return '-';
    const specs = product.specs;

    switch (key) {
      case 'price':
        return formatPrice(product.price);
      case 'category':
        return getCategoryLabel(product.category);
      case 'inStock':
        return product.inStock ? '在庫あり' : '売り切れ';
      case 'fanless':
        return specs.fanless ? 'Yes' : 'No';
      case 'layer':
        return (specs as SwitchSpecs).layer || '-';
      case 'poeSupply':
        const poe = (specs as SwitchSpecs).poeSupply || (specs as GatewaySpecs).poeBuiltIn;
        return poe ? `${poe}W` : '-';
      case 'ports10GbE':
        return String((specs as SwitchSpecs).ports10GbE || 0);
      case 'ports2_5GbE':
        return String((specs as SwitchSpecs).ports2_5GbE || 0);
      case 'sfpPlus':
        return String((specs as SwitchSpecs).sfpPlus || 0);
      case 'wifiStandard':
        return (specs as WiFiSpecs).wifiStandard || '-';
      case 'bands':
        return (specs as WiFiSpecs).bands?.join(', ') || '-';
      case 'uplinkSpeed':
        return (specs as WiFiSpecs).uplinkSpeed || '-';
      case 'coverage':
        const cov = (specs as WiFiSpecs).coverage;
        return cov ? `${cov}㎡` : '-';
      case 'ipsIds':
        const ips = (specs as GatewaySpecs).ipsIds;
        return ips ? `${ips}Gbps` : '-';
      default:
        return '-';
    }
  };

  const specRows = [
    { key: 'price', label: '価格' },
    { key: 'category', label: 'カテゴリ' },
    { key: 'inStock', label: '在庫状況' },
    { key: 'fanless', label: 'ファンレス' },
    { key: 'layer', label: 'Layer' },
    { key: 'poeSupply', label: 'PoE供給' },
    { key: 'ports10GbE', label: '10GbE RJ45' },
    { key: 'ports2_5GbE', label: '2.5GbE RJ45' },
    { key: 'sfpPlus', label: 'SFP+ (10G)' },
    { key: 'wifiStandard', label: 'WiFi規格' },
    { key: 'bands', label: '周波数帯' },
    { key: 'uplinkSpeed', label: 'アップリンク' },
    { key: 'coverage', label: 'カバレッジ' },
    { key: 'ipsIds', label: 'IPS/IDS' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#0f1419] border-t border-white/10 z-40 transform transition-transform">
      <div className="max-w-[1800px] mx-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-white">製品比較 ({compareProducts.length}/4)</h3>
          <button onClick={clearCompare} className="text-sm text-gray-400 hover:text-white">
            クリア
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="text-left py-2 px-3 text-gray-400 font-normal w-32">スペック</th>
                {products.map(product => (
                  <th key={product!.id} className="text-left py-2 px-3 min-w-[200px]">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-white font-medium">{product!.name}</p>
                        <p className="text-xs text-gray-500">{product!.model}</p>
                      </div>
                      <button
                        onClick={() => removeFromCompare(product!.id)}
                        className="text-gray-500 hover:text-red-400 ml-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {specRows.map(({ key, label }) => (
                <tr key={key} className="border-t border-white/5">
                  <td className="py-2 px-3 text-gray-400">{label}</td>
                  {products.map(product => (
                    <td key={product!.id} className="py-2 px-3 text-white">
                      {getSpecValue(product, key)}
                    </td>
                  ))}
                </tr>
              ))}
              <tr className="border-t border-white/10">
                <td className="py-3 px-3"></td>
                {products.map(product => (
                  <td key={product!.id} className="py-3 px-3">
                    <button
                      onClick={() => addProduct(product!.id)}
                      className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition-colors"
                    >
                      構成に追加
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
