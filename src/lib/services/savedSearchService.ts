import { SearchCriteria, SavedSearch } from '@/components/dealer/SavedSearchManager';

// Mock storage for saved searches (in real app, this would be a database)
let savedSearchesStorage: SavedSearch[] = [
  {
    id: 'search-1',
    name: 'High-Efficiency Air Handlers',
    description: 'Air handling units with high efficiency ratings for commercial projects',
    criteria: {
      searchQuery: 'air handling',
      selectedCategory: 'Air Handling Units',
      selectedBrand: 'All Brands',
      selectedApplication: 'Commercial Office',
      priceRange: [5000, 25000],
      showInStockOnly: true,
      sortBy: 'price-low',
    },
    createdAt: new Date('2024-01-15'),
    lastUsed: new Date('2024-01-20'),
    useCount: 12,
    isFavorite: true,
    tags: ['commercial', 'efficiency'],
  },
  {
    id: 'search-2',
    name: 'Healthcare HVAC Systems',
    description: 'Complete HVAC solutions for healthcare facilities',
    criteria: {
      searchQuery: '',
      selectedCategory: 'All Categories',
      selectedBrand: 'Dynamic AQS',
      selectedApplication: 'Healthcare',
      priceRange: [10000, 50000],
      showInStockOnly: false,
      sortBy: 'rating',
    },
    createdAt: new Date('2024-01-10'),
    lastUsed: new Date('2024-01-18'),
    useCount: 8,
    isFavorite: false,
    tags: ['healthcare', 'complete-system'],
  },
  {
    id: 'search-3',
    name: 'Budget Rooftop Units',
    description: 'Cost-effective rooftop units under $20K',
    criteria: {
      searchQuery: 'rooftop',
      selectedCategory: 'Rooftop Units',
      selectedBrand: 'All Brands',
      selectedApplication: 'All Applications',
      priceRange: [0, 20000],
      showInStockOnly: true,
      sortBy: 'price-low',
    },
    createdAt: new Date('2024-01-05'),
    lastUsed: new Date('2024-01-16'),
    useCount: 15,
    isFavorite: true,
    tags: ['budget', 'rooftop'],
  },
];

export class SavedSearchService {
  /**
   * Get all saved searches for the current dealer
   */
  static async getSavedSearches(): Promise<SavedSearch[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Sort by favorites first, then by last used
    return [...savedSearchesStorage].sort((a, b) => {
      if (a.isFavorite && !b.isFavorite) return -1;
      if (!a.isFavorite && b.isFavorite) return 1;
      return b.lastUsed.getTime() - a.lastUsed.getTime();
    });
  }

  /**
   * Save a new search
   */
  static async saveSearch(search: Omit<SavedSearch, 'id' | 'createdAt' | 'lastUsed' | 'useCount'>): Promise<SavedSearch> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));

    const newSearch: SavedSearch = {
      ...search,
      id: `search-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      lastUsed: new Date(),
      useCount: 0,
    };

    savedSearchesStorage.unshift(newSearch);
    return newSearch;
  }

  /**
   * Update an existing search
   */
  static async updateSearch(searchId: string, updates: Partial<Omit<SavedSearch, 'id' | 'createdAt'>>): Promise<SavedSearch> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));

    const searchIndex = savedSearchesStorage.findIndex(s => s.id === searchId);
    if (searchIndex === -1) {
      throw new Error('Search not found');
    }

    const updatedSearch = {
      ...savedSearchesStorage[searchIndex],
      ...updates,
    };

    savedSearchesStorage[searchIndex] = updatedSearch;
    return updatedSearch;
  }

  /**
   * Delete a saved search
   */
  static async deleteSearch(searchId: string): Promise<void> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));

    savedSearchesStorage = savedSearchesStorage.filter(s => s.id !== searchId);
  }

  /**
   * Record search usage (increment use count and update last used)
   */
  static async recordSearchUsage(searchId: string): Promise<SavedSearch> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));

    const searchIndex = savedSearchesStorage.findIndex(s => s.id === searchId);
    if (searchIndex === -1) {
      throw new Error('Search not found');
    }

    const updatedSearch = {
      ...savedSearchesStorage[searchIndex],
      lastUsed: new Date(),
      useCount: savedSearchesStorage[searchIndex].useCount + 1,
    };

    savedSearchesStorage[searchIndex] = updatedSearch;
    return updatedSearch;
  }

  /**
   * Toggle favorite status of a search
   */
  static async toggleFavorite(searchId: string): Promise<SavedSearch> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));

    const searchIndex = savedSearchesStorage.findIndex(s => s.id === searchId);
    if (searchIndex === -1) {
      throw new Error('Search not found');
    }

    const updatedSearch = {
      ...savedSearchesStorage[searchIndex],
      isFavorite: !savedSearchesStorage[searchIndex].isFavorite,
    };

    savedSearchesStorage[searchIndex] = updatedSearch;
    return updatedSearch;
  }

  /**
   * Duplicate a saved search
   */
  static async duplicateSearch(searchId: string): Promise<SavedSearch> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));

    const originalSearch = savedSearchesStorage.find(s => s.id === searchId);
    if (!originalSearch) {
      throw new Error('Search not found');
    }

    const duplicatedSearch: SavedSearch = {
      ...originalSearch,
      id: `search-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: `${originalSearch.name} (Copy)`,
      createdAt: new Date(),
      lastUsed: new Date(),
      useCount: 0,
      isFavorite: false,
    };

    savedSearchesStorage.unshift(duplicatedSearch);
    return duplicatedSearch;
  }

  /**
   * Get frequently used searches (top 5 by use count)
   */
  static async getFrequentlyUsedSearches(): Promise<SavedSearch[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));

    return [...savedSearchesStorage]
      .sort((a, b) => b.useCount - a.useCount)
      .slice(0, 5);
  }

  /**
   * Get favorite searches
   */
  static async getFavoriteSearches(): Promise<SavedSearch[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));

    return savedSearchesStorage
      .filter(s => s.isFavorite)
      .sort((a, b) => b.lastUsed.getTime() - a.lastUsed.getTime());
  }

  /**
   * Search within saved searches by name or description
   */
  static async searchSavedSearches(query: string): Promise<SavedSearch[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));

    const lowercaseQuery = query.toLowerCase();
    return savedSearchesStorage.filter(search => 
      search.name.toLowerCase().includes(lowercaseQuery) ||
      (search.description && search.description.toLowerCase().includes(lowercaseQuery)) ||
      search.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  }

  /**
   * Export search criteria as a shareable format
   */
  static exportSearchCriteria(criteria: SearchCriteria): string {
    const params = new URLSearchParams();
    
    if (criteria.searchQuery) params.set('q', criteria.searchQuery);
    if (criteria.selectedCategory !== 'All Categories') params.set('category', criteria.selectedCategory);
    if (criteria.selectedBrand !== 'All Brands') params.set('brand', criteria.selectedBrand);
    if (criteria.selectedApplication !== 'All Applications') params.set('application', criteria.selectedApplication);
    if (criteria.priceRange[0] > 0) params.set('minPrice', criteria.priceRange[0].toString());
    if (criteria.priceRange[1] < 60000) params.set('maxPrice', criteria.priceRange[1].toString());
    if (criteria.showInStockOnly) params.set('inStock', 'true');
    if (criteria.sortBy !== 'relevance') params.set('sort', criteria.sortBy);

    return params.toString();
  }

  /**
   * Import search criteria from a shareable format
   */
  static importSearchCriteria(queryString: string): SearchCriteria {
    const params = new URLSearchParams(queryString);
    
    return {
      searchQuery: params.get('q') || '',
      selectedCategory: params.get('category') || 'All Categories',
      selectedBrand: params.get('brand') || 'All Brands',
      selectedApplication: params.get('application') || 'All Applications',
      priceRange: [
        parseInt(params.get('minPrice') || '0'),
        parseInt(params.get('maxPrice') || '60000')
      ] as [number, number],
      showInStockOnly: params.get('inStock') === 'true',
      sortBy: params.get('sort') || 'relevance',
    };
  }
}