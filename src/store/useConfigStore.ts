import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { Configuration, ConfigItem, ProductFilters, ProductCategory } from '@/types';
import { products, getProductById } from '@/data/products';

interface ConfigState {
  // Current configuration being edited
  currentConfig: Configuration;
  // Saved configurations
  savedConfigs: Configuration[];
  // Products to compare
  compareProducts: string[];
  // Filters
  filters: ProductFilters;
  // View mode
  viewMode: 'grid' | 'list';

  // Configuration actions
  addProduct: (productId: string) => void;
  removeProduct: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearConfig: () => void;

  // Save/Load actions
  saveConfig: (name: string) => void;
  loadConfig: (id: string) => void;
  deleteConfig: (id: string) => void;
  renameConfig: (id: string, name: string) => void;

  // Compare actions
  addToCompare: (productId: string) => void;
  removeFromCompare: (productId: string) => void;
  clearCompare: () => void;

  // Filter actions
  setFilters: (filters: Partial<ProductFilters>) => void;
  resetFilters: () => void;

  // View actions
  setViewMode: (mode: 'grid' | 'list') => void;

  // Import/Export
  exportConfig: () => string;
  importConfig: (json: string) => boolean;
  getShareableUrl: () => string;
  loadFromUrl: (params: string) => void;
}

const defaultFilters: ProductFilters = {
  categories: [],
  subcategories: [],
  priceRange: [0, 1000000],
  inStockOnly: false,
  speeds: [],
  poeSupply: false,
  poePowered: false,
  fanless: false,
  layer3: false,
  wifi7: false,
  wifi6GHz: false,
  etherlighting: false,
  installationType: [],
  searchQuery: '',
};

const createEmptyConfig = (): Configuration => ({
  id: uuidv4(),
  name: '新規構成',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  items: [],
});

export const useConfigStore = create<ConfigState>()(
  persist(
    (set, get) => ({
      currentConfig: createEmptyConfig(),
      savedConfigs: [],
      compareProducts: [],
      filters: defaultFilters,
      viewMode: 'grid',

      addProduct: (productId: string) => {
        set((state) => {
          const existingItem = state.currentConfig.items.find(
            (item) => item.productId === productId
          );

          if (existingItem) {
            return {
              currentConfig: {
                ...state.currentConfig,
                updatedAt: new Date().toISOString(),
                items: state.currentConfig.items.map((item) =>
                  item.productId === productId
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
                ),
              },
            };
          }

          return {
            currentConfig: {
              ...state.currentConfig,
              updatedAt: new Date().toISOString(),
              items: [...state.currentConfig.items, { productId, quantity: 1 }],
            },
          };
        });
      },

      removeProduct: (productId: string) => {
        set((state) => ({
          currentConfig: {
            ...state.currentConfig,
            updatedAt: new Date().toISOString(),
            items: state.currentConfig.items.filter(
              (item) => item.productId !== productId
            ),
          },
        }));
      },

      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeProduct(productId);
          return;
        }

        set((state) => ({
          currentConfig: {
            ...state.currentConfig,
            updatedAt: new Date().toISOString(),
            items: state.currentConfig.items.map((item) =>
              item.productId === productId ? { ...item, quantity } : item
            ),
          },
        }));
      },

      clearConfig: () => {
        set({ currentConfig: createEmptyConfig() });
      },

      saveConfig: (name: string) => {
        set((state) => {
          const configToSave: Configuration = {
            ...state.currentConfig,
            id: uuidv4(),
            name,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          return {
            savedConfigs: [...state.savedConfigs, configToSave],
          };
        });
      },

      loadConfig: (id: string) => {
        const config = get().savedConfigs.find((c) => c.id === id);
        if (config) {
          set({ currentConfig: { ...config, updatedAt: new Date().toISOString() } });
        }
      },

      deleteConfig: (id: string) => {
        set((state) => ({
          savedConfigs: state.savedConfigs.filter((c) => c.id !== id),
        }));
      },

      renameConfig: (id: string, name: string) => {
        set((state) => ({
          savedConfigs: state.savedConfigs.map((c) =>
            c.id === id ? { ...c, name, updatedAt: new Date().toISOString() } : c
          ),
        }));
      },

      addToCompare: (productId: string) => {
        set((state) => {
          if (state.compareProducts.length >= 4) return state;
          if (state.compareProducts.includes(productId)) return state;
          return { compareProducts: [...state.compareProducts, productId] };
        });
      },

      removeFromCompare: (productId: string) => {
        set((state) => ({
          compareProducts: state.compareProducts.filter((id) => id !== productId),
        }));
      },

      clearCompare: () => {
        set({ compareProducts: [] });
      },

      setFilters: (filters: Partial<ProductFilters>) => {
        set((state) => ({
          filters: { ...state.filters, ...filters },
        }));
      },

      resetFilters: () => {
        set({ filters: defaultFilters });
      },

      setViewMode: (mode: 'grid' | 'list') => {
        set({ viewMode: mode });
      },

      exportConfig: () => {
        return JSON.stringify(get().currentConfig, null, 2);
      },

      importConfig: (json: string) => {
        try {
          const config = JSON.parse(json) as Configuration;
          if (config.items && Array.isArray(config.items)) {
            set({
              currentConfig: {
                ...config,
                id: uuidv4(),
                updatedAt: new Date().toISOString(),
              },
            });
            return true;
          }
          return false;
        } catch {
          return false;
        }
      },

      getShareableUrl: () => {
        const config = get().currentConfig;
        const items = config.items.map((item) => `${item.productId}:${item.quantity}`).join(',');
        const params = new URLSearchParams({ items, name: config.name });
        return `${typeof window !== 'undefined' ? window.location.origin : ''}?${params.toString()}`;
      },

      loadFromUrl: (params: string) => {
        try {
          const urlParams = new URLSearchParams(params);
          const itemsStr = urlParams.get('items');
          const name = urlParams.get('name') || '共有された構成';

          if (itemsStr) {
            const items: ConfigItem[] = itemsStr.split(',').map((item) => {
              const [productId, quantity] = item.split(':');
              return { productId, quantity: parseInt(quantity, 10) || 1 };
            }).filter((item) => getProductById(item.productId));

            if (items.length > 0) {
              set({
                currentConfig: {
                  id: uuidv4(),
                  name,
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                  items,
                },
              });
            }
          }
        } catch {
          // Ignore parsing errors
        }
      },
    }),
    {
      name: 'unifi-config-storage',
      partialize: (state) => ({
        savedConfigs: state.savedConfigs,
        currentConfig: state.currentConfig,
      }),
    }
  )
);

// Selector functions
export function useFilteredProducts() {
  const filters = useConfigStore((state) => state.filters);

  return products.filter((product) => {
    // Category filter
    if (filters.categories.length > 0 && !filters.categories.includes(product.category as ProductCategory)) {
      return false;
    }

    // Subcategory filter
    if (filters.subcategories.length > 0 && product.subcategory && !filters.subcategories.includes(product.subcategory)) {
      return false;
    }

    // Price range filter
    if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
      return false;
    }

    // In stock filter
    if (filters.inStockOnly && !product.inStock) {
      return false;
    }

    // Search query
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      const searchable = `${product.name} ${product.model} ${product.description}`.toLowerCase();
      if (!searchable.includes(query)) {
        return false;
      }
    }

    // Fanless filter
    if (filters.fanless && !product.specs.fanless) {
      return false;
    }

    // Layer 3 filter (switches only)
    if (filters.layer3 && product.category === 'switch') {
      const switchSpecs = product.specs as { layer?: string };
      if (switchSpecs.layer !== 'L3') {
        return false;
      }
    }

    // WiFi 7 filter
    if (filters.wifi7 && product.category === 'wifi') {
      const wifiSpecs = product.specs as { wifiStandard?: string };
      if (wifiSpecs.wifiStandard !== 'WiFi 7') {
        return false;
      }
    }

    // 6GHz filter
    if (filters.wifi6GHz && product.category === 'wifi') {
      const wifiSpecs = product.specs as { bands?: string[] };
      if (!wifiSpecs.bands?.includes('6G')) {
        return false;
      }
    }

    // Etherlighting filter
    if (filters.etherlighting && product.category === 'switch') {
      const switchSpecs = product.specs as { etherlighting?: boolean };
      if (!switchSpecs.etherlighting) {
        return false;
      }
    }

    // PoE supply filter
    if (filters.poeSupply) {
      const specs = product.specs as { poeSupply?: number; poeBuiltIn?: number };
      if (!specs.poeSupply && !specs.poeBuiltIn) {
        return false;
      }
    }

    // PoE powered filter
    if (filters.poePowered) {
      const specs = product.specs as { poePowered?: boolean };
      if (!specs.poePowered) {
        return false;
      }
    }

    return true;
  });
}
