// Product Categories - based on Japanese store structure
export type ProductCategory =
  | 'gateway'
  | 'switch'
  | 'wifi'
  | 'camera'
  | 'nvr'
  | 'nas'
  | 'access'
  | 'hosting'
  | 'accessory';

export type SwitchSubcategory =
  | 'aggregation'
  | 'enterprise'
  | 'pro-max'
  | 'pro-xg'
  | 'professional'
  | 'standard'
  | 'utility';

export type WiFiSubcategory =
  | 'flagship'
  | 'building-to-building'
  | 'in-wall'
  | 'outdoor'
  | 'specialty';

export type AccessorySubcategory =
  | 'rj45-copper'
  | 'sfp-fiber'
  | 'storage'
  | 'rack-mount'
  | 'poe-power'
  | 'ap-accessories'
  | 'camera-accessories';

export type ProductSubcategory = SwitchSubcategory | WiFiSubcategory | AccessorySubcategory | string;

// Port configuration types
export interface PortConfig {
  count: number;
  speed: '1G' | '2.5G' | '10G' | '25G' | '100G';
  type: 'RJ45' | 'SFP' | 'SFP+' | 'SFP28' | 'QSFP28';
}

// PoE Types
export type PoEType = 'PoE' | 'PoE+' | 'PoE++' | 'passive';

// WiFi Standards
export type WiFiStandard = 'WiFi 5' | 'WiFi 6' | 'WiFi 6E' | 'WiFi 7';

// Layer types for switches
export type SwitchLayer = 'L2' | 'L3';

// Installation types
export type InstallationType = 'ceiling' | 'wall' | 'outdoor' | 'rack' | 'desktop';

// Base product specs - common to all products
export interface BaseSpecs {
  fanless?: boolean;
  dimensions?: string;
  weight?: string;
  powerConsumption?: number; // Watts
}

// Gateway specific specs
export interface GatewaySpecs extends BaseSpecs {
  wanPorts: PortConfig[];
  lanPorts: PortConfig[];
  sfpPorts?: PortConfig[];
  ipsIds?: number; // Gbps
  wifiBuiltIn?: WiFiStandard;
  poeBuiltIn?: number; // Watts
  nvrStorage?: boolean;
  hddBays?: number;
  maxDevices?: number;
  maxClients?: number;
}

// Switch specific specs
export interface SwitchSpecs extends BaseSpecs {
  totalPorts: number;
  ports1GbE?: number;
  ports2_5GbE?: number;
  ports10GbE?: number;
  sfpPlus?: number; // 10G
  sfp28?: number; // 25G
  qsfp28?: number; // 100G
  poeSupply?: number; // Total Watts
  poeType?: PoEType;
  poePowered?: boolean; // Can be powered via PoE
  layer: SwitchLayer;
  etherlighting?: boolean;
  rackMount?: boolean;
  redundantPower?: boolean;
}

// WiFi AP specific specs
export interface WiFiSpecs extends BaseSpecs {
  wifiStandard: WiFiStandard;
  spatialStreams: number;
  bands: ('2.4G' | '5G' | '6G')[];
  uplinkSpeed: '1G' | '2.5G' | '10G';
  poeRequired: PoEType;
  maxClients?: number;
  coverage?: number; // square meters
  installationType: InstallationType;
  meshSupport?: boolean;
}

// Camera specific specs
export interface CameraSpecs extends BaseSpecs {
  resolution: 'HD' | '2K' | '4K';
  ai?: boolean;
  opticalZoom?: number;
  indoor?: boolean;
  outdoor?: boolean;
  ipRating?: string;
  poeRequired?: PoEType;
  nightVision?: boolean;
  ptzSupport?: boolean;
}

// NVR specific specs
export interface NVRSpecs extends BaseSpecs {
  hddBays: number;
  maxCameras4K?: number;
  maxCamerasFHD?: number;
  recordingDays?: number;
  networkPorts: PortConfig[];
}

// NAS specific specs
export interface NASSpecs extends BaseSpecs {
  hddBays: number;
  networkPorts: PortConfig[];
  unifiDrive?: boolean;
}

// Accessory specific specs
export interface AccessorySpecs extends BaseSpecs {
  accessoryType: 'dac' | 'sfp' | 'poe' | 'cable' | 'storage' | 'mount' | 'power' | 'cover';
  speed?: '1G' | '10G' | '25G' | '100G';
  cableLength?: number; // meters
  compatibleProducts?: string[];
  capacity?: string; // for storage
}

// Union type for all specs
export type ProductSpecs =
  | GatewaySpecs
  | SwitchSpecs
  | WiFiSpecs
  | CameraSpecs
  | NVRSpecs
  | NASSpecs
  | AccessorySpecs;

// Main Product interface
export interface Product {
  id: string;
  name: string;
  model: string;
  category: ProductCategory;
  subcategory?: ProductSubcategory;
  price: number; // Tax-inclusive JPY
  inStock: boolean;
  description: string;
  specs: ProductSpecs;
  storeUrl: string;
  imageUrl?: string;
  poeConsumption?: number; // Estimated PoE consumption in Watts
  releaseYear?: number;
}

// Configuration types
export interface ConfigItem {
  productId: string;
  quantity: number;
}

export interface Configuration {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  items: ConfigItem[];
}

// Configuration summary
export interface ConfigSummary {
  totalPrice: number;
  totalPoESupply: number;
  totalPoEConsumption: number;
  total10GPorts: number;
  total25GPorts: number;
  totalWiFiCoverage: number;
  hasGateway: boolean;
  warnings: ConfigWarning[];
}

// Warning types
export interface ConfigWarning {
  type: 'error' | 'warning' | 'info';
  message: string;
  category: string;
}

// Filter types
export interface ProductFilters {
  categories: ProductCategory[];
  subcategories: ProductSubcategory[];
  priceRange: [number, number];
  inStockOnly: boolean;
  speeds: ('1G' | '2.5G' | '10G' | '25G' | '100G')[];
  poeSupply: boolean;
  poePowered: boolean;
  fanless: boolean;
  layer3: boolean;
  wifi7: boolean;
  wifi6GHz: boolean;
  etherlighting: boolean;
  installationType: InstallationType[];
  searchQuery: string;
}

// Template configuration
export interface ConfigTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  items: ConfigItem[];
}

// Product comparison
export interface CompareProduct {
  productId: string;
}
