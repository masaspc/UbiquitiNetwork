'use client';

import { Product, SwitchSpecs, WiFiSpecs, GatewaySpecs, CameraSpecs, NVRSpecs } from '@/types';
import { formatPrice, getCategoryLabel } from '@/lib/utils';
import { useConfigStore } from '@/store/useConfigStore';

interface ProductCardProps {
  product: Product;
}

// Port icon component
function PortIcon({ type, speed, count }: { type: string; speed: string; count: number }) {
  const getColor = () => {
    switch (speed) {
      case '100G': return 'bg-purple-500';
      case '25G': return 'bg-pink-500';
      case '10G': return 'bg-orange-500';
      case '2.5G': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="flex items-center gap-1">
      <div className={`w-2 h-2 rounded-full ${getColor()}`} />
      <span className="text-xs text-gray-300">{count}× {speed} {type}</span>
    </div>
  );
}

// PoE indicator
function PoEIndicator({ supply, consumption }: { supply?: number; consumption?: number }) {
  if (supply) {
    return (
      <div className="flex items-center gap-1 text-green-400">
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
        <span className="text-xs font-medium">{supply}W供給</span>
      </div>
    );
  }
  if (consumption) {
    return (
      <div className="flex items-center gap-1 text-yellow-400">
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
        <span className="text-xs">{consumption}W消費</span>
      </div>
    );
  }
  return null;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addProduct, addToCompare, compareProducts } = useConfigStore();
  const isInCompare = compareProducts.includes(product.id);

  // Render port summary for switches
  const renderSwitchPorts = () => {
    if (product.category !== 'switch') return null;
    const specs = product.specs as SwitchSpecs;

    return (
      <div className="bg-gray-800/50 rounded-lg p-2 mb-3 space-y-1">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-medium text-gray-300">ポート構成</span>
          <span className="text-xs text-gray-500">{specs.layer}</span>
        </div>
        <div className="grid grid-cols-2 gap-1">
          {specs.ports10GbE && specs.ports10GbE > 0 && (
            <PortIcon type="RJ45" speed="10G" count={specs.ports10GbE} />
          )}
          {specs.ports2_5GbE && specs.ports2_5GbE > 0 && (
            <PortIcon type="RJ45" speed="2.5G" count={specs.ports2_5GbE} />
          )}
          {specs.ports1GbE && specs.ports1GbE > 0 && (
            <PortIcon type="RJ45" speed="1G" count={specs.ports1GbE} />
          )}
          {specs.sfp28 && specs.sfp28 > 0 && (
            <PortIcon type="SFP28" speed="25G" count={specs.sfp28} />
          )}
          {specs.sfpPlus && specs.sfpPlus > 0 && (
            <PortIcon type="SFP+" speed="10G" count={specs.sfpPlus} />
          )}
          {specs.qsfp28 && specs.qsfp28 > 0 && (
            <PortIcon type="QSFP28" speed="100G" count={specs.qsfp28} />
          )}
        </div>
        {specs.poeSupply && (
          <div className="pt-1 border-t border-gray-700">
            <PoEIndicator supply={specs.poeSupply} />
          </div>
        )}
      </div>
    );
  };

  // Render port summary for gateways
  const renderGatewayPorts = () => {
    if (product.category !== 'gateway') return null;
    const specs = product.specs as GatewaySpecs;

    return (
      <div className="bg-gray-800/50 rounded-lg p-2 mb-3 space-y-1">
        <div className="text-xs font-medium text-gray-300 mb-1">ポート構成</div>
        <div className="space-y-1">
          {specs.wanPorts.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-blue-400 w-8">WAN</span>
              <div className="flex flex-wrap gap-1">
                {specs.wanPorts.map((port, i) => (
                  <span key={i} className="text-xs bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded">
                    {port.count}× {port.speed} {port.type}
                  </span>
                ))}
              </div>
            </div>
          )}
          {specs.lanPorts.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-green-400 w-8">LAN</span>
              <div className="flex flex-wrap gap-1">
                {specs.lanPorts.map((port, i) => (
                  <span key={i} className="text-xs bg-green-500/20 text-green-300 px-1.5 py-0.5 rounded">
                    {port.count}× {port.speed} {port.type}
                  </span>
                ))}
              </div>
            </div>
          )}
          {specs.sfpPorts && specs.sfpPorts.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-orange-400 w-8">SFP</span>
              <div className="flex flex-wrap gap-1">
                {specs.sfpPorts.map((port, i) => (
                  <span key={i} className="text-xs bg-orange-500/20 text-orange-300 px-1.5 py-0.5 rounded">
                    {port.count}× {port.speed}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-2 pt-1 border-t border-gray-700">
          {specs.ipsIds && (
            <span className="text-xs text-purple-400">IPS {specs.ipsIds}Gbps</span>
          )}
          {specs.wifiBuiltIn && (
            <span className="text-xs text-cyan-400">{specs.wifiBuiltIn}</span>
          )}
          {specs.poeBuiltIn && (
            <PoEIndicator supply={specs.poeBuiltIn} />
          )}
        </div>
      </div>
    );
  };

  // Render WiFi specs
  const renderWiFiSpecs = () => {
    if (product.category !== 'wifi') return null;
    const specs = product.specs as WiFiSpecs;

    return (
      <div className="bg-gray-800/50 rounded-lg p-2 mb-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-bold text-white">{specs.wifiStandard}</span>
          <span className="text-xs text-gray-400">{specs.spatialStreams}ストリーム</span>
        </div>
        <div className="flex flex-wrap gap-1 mb-2">
          {specs.bands.map((band) => (
            <span
              key={band}
              className={`text-xs px-1.5 py-0.5 rounded ${
                band === '6G' ? 'bg-purple-500/30 text-purple-300' :
                band === '5G' ? 'bg-blue-500/30 text-blue-300' :
                'bg-gray-500/30 text-gray-300'
              }`}
            >
              {band}
            </span>
          ))}
        </div>
        <div className="flex justify-between text-xs text-gray-400">
          <span>↑{specs.uplinkSpeed} Uplink</span>
          <span>{specs.coverage}m² カバー</span>
        </div>
        {product.poeConsumption && (
          <div className="mt-1 pt-1 border-t border-gray-700">
            <PoEIndicator consumption={product.poeConsumption} />
          </div>
        )}
      </div>
    );
  };

  // Render Camera specs
  const renderCameraSpecs = () => {
    if (product.category !== 'camera') return null;
    const specs = product.specs as CameraSpecs;

    return (
      <div className="bg-gray-800/50 rounded-lg p-2 mb-3">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm font-bold text-white">{specs.resolution}</span>
          {specs.ai && <span className="text-xs bg-purple-500/30 text-purple-300 px-1.5 py-0.5 rounded">AI</span>}
        </div>
        <div className="flex flex-wrap gap-1">
          {specs.indoor && <span className="text-xs bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded">屋内</span>}
          {specs.outdoor && <span className="text-xs bg-green-500/20 text-green-300 px-1.5 py-0.5 rounded">屋外</span>}
          {specs.nightVision && <span className="text-xs bg-gray-500/20 text-gray-300 px-1.5 py-0.5 rounded">暗視</span>}
        </div>
        {product.poeConsumption && (
          <div className="mt-1 pt-1 border-t border-gray-700">
            <PoEIndicator consumption={product.poeConsumption} />
          </div>
        )}
      </div>
    );
  };

  // Render NVR specs
  const renderNVRSpecs = () => {
    if (product.category !== 'nvr') return null;
    const specs = product.specs as NVRSpecs;

    return (
      <div className="bg-gray-800/50 rounded-lg p-2 mb-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-bold text-white">{specs.hddBays} HDDベイ</span>
        </div>
        <div className="text-xs text-gray-400">
          <div>4K: 最大{specs.maxCameras4K}台</div>
          <div>FHD: 最大{specs.maxCamerasFHD}台</div>
        </div>
      </div>
    );
  };

  // Get fallback image based on category
  const getProductImage = () => {
    if (product.imageUrl) return product.imageUrl;

    // Default placeholder based on category
    const placeholders: Record<string, string> = {
      gateway: 'https://cdn.ecomm.ui.com/products/574fa68d-a8e4-4520-8a13-7b7d16cf26db/c7ed9fb0-d44b-42e6-ba00-3e8c13c9cbf5.png',
      switch: 'https://cdn.ecomm.ui.com/products/a6a66318-baca-4c4e-b3d1-8299b0c4ed26/69548fe6-f2ad-4b66-b42d-2e5bd389c22a.png',
      wifi: 'https://cdn.ecomm.ui.com/products/8b7d1cd3-13d6-4dce-b0ba-2e0e8d624800/d6b6e5fc-d97d-4ebe-8e14-92e3c9afcb16.png',
      camera: 'https://cdn.ecomm.ui.com/products/7baf3f58-9151-4894-9009-d62d52d4c2af/5d9ede0b-6a0e-4c8b-9b2f-5d7dfc6e4f2d.png',
      nvr: 'https://cdn.ecomm.ui.com/products/a1a1f4ae-fc02-47e3-974f-a1c1e0e15c37/b8c35f2c-4bb4-4b42-8b4c-9fefea4f8d0f.png',
      accessory: 'https://cdn.ecomm.ui.com/products/ee614bc5-b7b3-4b56-930d-2ce5f2c85e38/a69e6f9e-0b73-47de-977f-5cfdd5c38b26.png',
    };

    return placeholders[product.category] || placeholders.accessory;
  };

  return (
    <div className="card p-4 flex flex-col h-full">
      {/* Header */}
      <div className="flex justify-between items-start mb-2">
        <span className="text-xs text-gray-400">{getCategoryLabel(product.category)}</span>
        <span className={`text-xs px-2 py-0.5 rounded-full ${product.inStock ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
          {product.inStock ? '在庫あり' : '売り切れ'}
        </span>
      </div>

      {/* Product Image */}
      <div className="relative h-32 mb-3 bg-gray-800/30 rounded-lg overflow-hidden flex items-center justify-center">
        <img
          src={getProductImage()}
          alt={product.name}
          className="max-h-full max-w-full object-contain p-2"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
          }}
        />
      </div>

      {/* Product Name & Model */}
      <h3 className="text-white font-semibold mb-1 leading-tight">{product.name}</h3>
      <p className="text-xs text-gray-500 mb-2">{product.model}</p>

      {/* Category-specific specs */}
      {renderSwitchPorts()}
      {renderGatewayPorts()}
      {renderWiFiSpecs()}
      {renderCameraSpecs()}
      {renderNVRSpecs()}

      {/* Description */}
      <p className="text-xs text-gray-400 mb-3 flex-grow line-clamp-2">{product.description}</p>

      {/* Price & Actions */}
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
          <a
            href={product.storeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 rounded-lg text-sm bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="公式ストアで見る"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
