// Custom storage adapter for Next.js SSR compatibility
const createNoopStorage = () => {
  return {
    getItem(_key: string): Promise<string | null> {
      return Promise.resolve(null);
    },
    setItem(_key: string, _value: any): Promise<void> {
      return Promise.resolve();
    },
    removeItem(_key: string): Promise<void> {
      return Promise.resolve();
    },
  };
};

// Create storage that works in both SSR and browser
const storage = (() => {
  if (typeof window === 'undefined') {
    // Server-side: return noop storage
    return createNoopStorage();
  }
  
  // Client-side: use localStorage
  try {
    // Import the default storage from redux-persist
    const reduxPersistStorage = require('redux-persist/lib/storage');
    return reduxPersistStorage.default || reduxPersistStorage;
  } catch (error) {
    // Fallback to noop if import fails
    console.warn('Failed to create redux-persist storage, using noop storage:', error);
    return createNoopStorage();
  }
})();

export default storage;

