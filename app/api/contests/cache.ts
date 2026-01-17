

type CacheType = {
  data: any;
  timestamp: number;
} | null;

// In-memory cache (lives in server RAM)
let cache: CacheType = null;

// 5 minutes
const CACHE_DURATION = 5 * 60 * 1000;

export function getCachedData() {
  if (!cache) return null;

  const isExpired = Date.now() - cache.timestamp > CACHE_DURATION;
  if (isExpired) {
    cache = null;
    return null;
  }

  return cache.data;
}

export function setCachedData(data: any) {
  cache = {
    data,
    timestamp: Date.now(),
  };
}
