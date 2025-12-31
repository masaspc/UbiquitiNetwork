import { Product, ConfigItem, ConfigSummary, ConfigWarning, SwitchSpecs, WiFiSpecs, GatewaySpecs } from '@/types';
import { getProductById } from '@/data/products';

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
    maximumFractionDigits: 0,
  }).format(price);
}

export function calculateConfigSummary(items: ConfigItem[]): ConfigSummary {
  let totalPrice = 0;
  let totalPoESupply = 0;
  let totalPoEConsumption = 0;
  let total10GPorts = 0;
  let total25GPorts = 0;
  let totalWiFiCoverage = 0;
  let hasGateway = false;
  const warnings: ConfigWarning[] = [];

  items.forEach(({ productId, quantity }) => {
    const product = getProductById(productId);
    if (!product) return;

    totalPrice += product.price * quantity;

    if (product.category === 'gateway') {
      hasGateway = true;
      const specs = product.specs as GatewaySpecs;
      if (specs.poeBuiltIn) totalPoESupply += specs.poeBuiltIn * quantity;
      if (specs.sfpPorts) {
        specs.sfpPorts.forEach(p => {
          if (p.speed === '10G') total10GPorts += p.count * quantity;
          if (p.speed === '25G') total25GPorts += p.count * quantity;
        });
      }
    }

    if (product.category === 'switch') {
      const specs = product.specs as SwitchSpecs;
      if (specs.poeSupply) totalPoESupply += specs.poeSupply * quantity;
      if (specs.sfpPlus) total10GPorts += specs.sfpPlus * quantity;
      if (specs.sfp28) total25GPorts += specs.sfp28 * quantity;
      if (specs.ports10GbE) total10GPorts += specs.ports10GbE * quantity;
    }

    if (product.category === 'wifi') {
      const specs = product.specs as WiFiSpecs;
      if (specs.coverage) totalWiFiCoverage += specs.coverage * quantity;
      if (product.poeConsumption) totalPoEConsumption += product.poeConsumption * quantity;
    }

    if (product.category === 'camera' && product.poeConsumption) {
      totalPoEConsumption += product.poeConsumption * quantity;
    }
  });

  // Validation warnings
  if (items.length > 0 && !hasGateway) {
    warnings.push({
      type: 'warning',
      message: 'ゲートウェイが選択されていません。ネットワークの中心となるゲートウェイの追加を検討してください。',
      category: 'gateway',
    });
  }

  if (totalPoEConsumption > totalPoESupply && totalPoESupply > 0) {
    warnings.push({
      type: 'error',
      message: `PoE消費電力(${totalPoEConsumption}W)がPoE供給(${totalPoESupply}W)を超えています。`,
      category: 'poe',
    });
  }

  const has10GDevice = items.some(({ productId }) => {
    const p = getProductById(productId);
    if (!p) return false;
    if (p.category === 'switch') {
      const s = p.specs as SwitchSpecs;
      return s.sfpPlus || s.ports10GbE;
    }
    if (p.category === 'wifi') {
      const w = p.specs as WiFiSpecs;
      return w.uplinkSpeed === '10G';
    }
    return false;
  });

  const hasDACCable = items.some(({ productId }) => {
    const p = getProductById(productId);
    return p?.category === 'accessory' && p.subcategory === 'sfp-fiber';
  });

  if (has10GDevice && !hasDACCable) {
    warnings.push({
      type: 'info',
      message: '10G機器がありますが、SFP+ケーブル/DACが選択されていません。',
      category: 'cable',
    });
  }

  return {
    totalPrice,
    totalPoESupply,
    totalPoEConsumption,
    total10GPorts,
    total25GPorts,
    totalWiFiCoverage,
    hasGateway,
    warnings,
  };
}

export function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    gateway: 'Cloud Gateway',
    switch: 'Switching',
    wifi: 'WiFi',
    camera: 'Camera',
    nvr: 'NVR',
    nas: 'NAS',
    access: 'Door Access',
    hosting: 'Advanced Hosting',
    accessory: 'Accessories',
  };
  return labels[category] || category;
}

export function getSubcategoryLabel(subcategory: string): string {
  const labels: Record<string, string> = {
    aggregation: 'Aggregation',
    enterprise: 'Enterprise',
    'pro-max': 'Pro Max',
    'pro-xg': 'Pro XG',
    professional: 'Professional',
    standard: 'Standard',
    utility: 'Utility (Flex/Ultra)',
    flagship: 'Flagship',
    'in-wall': 'In-Wall',
    outdoor: 'Outdoor',
    'sfp-fiber': 'SFP & Fiber',
    'poe-power': 'PoE & Power',
    storage: 'Storage',
    'rack-mount': 'Rack Mount',
  };
  return labels[subcategory] || subcategory;
}
