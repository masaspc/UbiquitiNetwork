'use client';

import { useConfigStore } from '@/store/useConfigStore';
import { ConfigTemplate } from '@/types';

const templates: ConfigTemplate[] = [
  {
    id: 'small-home',
    name: '小規模ホーム (1LDK〜2LDK)',
    description: 'コンパクトな住居向けの基本構成。WiFi 7対応で高速接続。',
    icon: '🏠',
    items: [
      { productId: 'ucg-ultra', quantity: 1 },
      { productId: 'usw-lite-8-poe', quantity: 1 },
      { productId: 'u7-lite', quantity: 1 },
    ],
  },
  {
    id: 'medium-home',
    name: '中規模ホーム (3LDK〜一戸建て)',
    description: '広い住居向けの構成。複数APで全域カバー。',
    icon: '🏡',
    items: [
      { productId: 'ucg-ultra', quantity: 1 },
      { productId: 'usw-pro-max-16-poe', quantity: 1 },
      { productId: 'u7-lite', quantity: 2 },
      { productId: 'u7-iw', quantity: 1 },
    ],
  },
  {
    id: 'home-office',
    name: 'ホームオフィス',
    description: '在宅勤務向け。U7 Proで高速・安定接続。',
    icon: '💼',
    items: [
      { productId: 'ux7', quantity: 1 },
      { productId: 'usw-pro-max-16-poe', quantity: 1 },
      { productId: 'u7-pro', quantity: 1 },
      { productId: 'uacc-dac-sfp10-1m', quantity: 2 },
    ],
  },
  {
    id: 'full-10g-lab',
    name: 'フル10Gホームラボ',
    description: '10Gネットワーク構築。U7 Pro XGS搭載。',
    icon: '🚀',
    items: [
      { productId: 'udm-pro-max', quantity: 1 },
      { productId: 'usw-pro-xg-8-poe', quantity: 1 },
      { productId: 'usw-aggregation', quantity: 1 },
      { productId: 'u7-pro-xgs', quantity: 2 },
      { productId: 'uacc-dac-sfp10-1m', quantity: 4 },
    ],
  },
  {
    id: 'security-camera',
    name: '防犯カメラシステム',
    description: 'UniFi Protectでセキュリティ構築。',
    icon: '📹',
    items: [
      { productId: 'udm-pro-max', quantity: 1 },
      { productId: 'usw-pro-24-poe', quantity: 1 },
      { productId: 'unvr', quantity: 1 },
      { productId: 'uvc-g5-flex', quantity: 4 },
      { productId: 'uvc-g5-bullet', quantity: 2 },
      { productId: 'uacc-hdd-8tb', quantity: 2 },
    ],
  },
];

export default function Templates() {
  const { clearConfig, addProduct } = useConfigStore();

  const applyTemplate = (template: ConfigTemplate) => {
    clearConfig();
    template.items.forEach(({ productId, quantity }) => {
      for (let i = 0; i < quantity; i++) {
        addProduct(productId);
      }
    });
  };

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-white mb-4">おすすめ構成テンプレート</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {templates.map(template => (
          <button
            key={template.id}
            onClick={() => applyTemplate(template)}
            className="card p-4 text-left hover:border-blue-500/50 transition-colors group"
          >
            <div className="text-2xl mb-2">{template.icon}</div>
            <h3 className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors">
              {template.name}
            </h3>
            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{template.description}</p>
            <p className="text-xs text-gray-600 mt-2">{template.items.length}製品</p>
          </button>
        ))}
      </div>
    </div>
  );
}
