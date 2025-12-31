'use client';

import { Product, SwitchSpecs, WiFiSpecs, GatewaySpecs } from '@/types';
import { formatPrice, getCategoryLabel } from '@/lib/utils';
import { useConfigStore } from '@/store/useConfigStore';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addProduct, addToCompare, compareProducts } = useConfigStore();
  const isInCompare = compareProducts.includes(product.id);

  const getSpeedBadges = () => {
    const badges: string[] = [];
    if (product.category === 'switch') {
      const specs = product.specs as SwitchSpecs;
      if (specs.ports10GbE) badges.push('10GbE');
      if (specs.ports2_5GbE) badges.push('2.5GbE');
      if (specs.sfpPlus) badges.push('SFP+');
      if (specs.sfp28) badges.push('25G');
      if (specs.poeSupply) badges.push(`PoE ${specs.poeSupply}W`);
    }
    if (product.category === 'wifi') {
      const specs = product.specs as WiFiSpecs;
      badges.push(specs.wifiStandard);
      if (specs.bands.includes('6G')) badges.push('6GHz');
      badges.push(`${specs.uplinkSpeed} Uplink`);
    }
    if (product.category === 'gateway') {
      const specs = product.specs as GatewaySpecs;
      if (specs.ipsIds) badges.push(`IPS ${specs.ipsIds}Gbps`);
      if (specs.wifiBuiltIn) badges.push(specs.wifiBuiltIn);
      if (specs.poeBuiltIn) badges.push(`PoE ${specs.poeBuiltIn}W`);
    }
    return badges.slice(0, 4);
  };

  return (
    <div className="card p-4 flex flex-col h-full">
      <div className="flex justify-between items-start mb-3">
        <span className="text-xs text-gray-400">{getCategoryLabel(product.category)}</span>
        <span className={`text-xs px-2 py-0.5 rounded-full ${product.inStock ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
          {product.inStock ? '在庫あり' : '売り切れ'}
        </span>
      </div>

      <h3 className="text-white font-semibold mb-1">{product.name}</h3>
      <p className="text-xs text-gray-500 mb-2">{product.model}</p>

      <div className="flex flex-wrap gap-1 mb-3">
        {getSpeedBadges().map((badge, i) => (
          <span key={i} className="text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-400">
            {badge}
          </span>
        ))}
      </div>

      <p className="text-sm text-gray-400 mb-4 flex-grow line-clamp-2">{product.description}</p>

      <div className="mt-auto">
        <p className="text-xl font-bold text-white mb-3">{formatPrice(product.price)}</p>

        <div className="flex gap-2">
          <button
            onClick={() => addProduct(product.id)}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-sm py-2 px-3 rounded-lg transition-colors"
          >
            追加
          </button>
          <button
            onClick={() => addToCompare(product.id)}
            disabled={isInCompare || compareProducts.length >= 4}
            className={`px-3 py-2 rounded-lg text-sm transition-colors ${
              isInCompare
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
            title="比較に追加"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
