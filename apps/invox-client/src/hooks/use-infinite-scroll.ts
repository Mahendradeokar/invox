"use client";

import { useState, useRef, useEffect, useCallback } from "react";

type FetchFn<T> = (
  page: number,
  limit: number
) => Promise<{ items: T[]; hasMore: boolean }>;

interface UseInfiniteScrollOptions<T> {
  fetchFn: FetchFn<T>;
  initialData?: T[];
  limit?: number;
  eagerLoad?: boolean;
  root?: Element | Document | null;
  rootMargin?: string;
  threshold?: number;
  totalRecords: number;
}

export function useInfiniteScroll<T>({
  fetchFn,
  initialData = [],
  limit = 10,
  eagerLoad = false,
  root = null,
  rootMargin = "200px",
  threshold = 0,
  totalRecords,
}: UseInfiniteScrollOptions<T>) {
  const [items, setItems] = useState<T[]>(initialData);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<unknown>(null);

  // Set hasMore initially based on totalRecords and initialData
  const initialHasMore = initialData.length < totalRecords;
  const [hasMore, setHasMore] = useState<boolean>(initialHasMore);

  // Helper to get the next page, but don't go past totalRecords
  const getNextPage = (
    currentItemsLength: number,
    limit: number,
    totalRecords: number
  ) => {
    if (currentItemsLength === 0) return 1;
    // If all records are loaded, don't increment page
    if (currentItemsLength >= totalRecords)
      return Math.ceil(totalRecords / limit);
    return Math.floor(currentItemsLength / limit) + 1;
  };

  const pageRef = useRef<number>(
    getNextPage(initialData.length, limit, totalRecords)
  );
  const loaderRef = useRef<HTMLDivElement>(null);

  const fetchFnRef = useRef<FetchFn<T>>(fetchFn);
  fetchFnRef.current = fetchFn;

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    setError(null);
    try {
      const { items: newItems, hasMore: more } = await fetchFnRef.current(
        pageRef.current,
        limit
      );
      setItems((prev) => {
        const updated = [...prev, ...newItems];
        // If we've loaded all records, set hasMore to false
        if (updated.length >= totalRecords) {
          setHasMore(false);
        } else {
          setHasMore(more && updated.length < totalRecords);
        }
        return updated;
      });
      pageRef.current = getNextPage(
        items.length + newItems.length,
        limit,
        totalRecords
      );
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [limit, loading, hasMore, items.length, totalRecords]);

  const setExternalData = useCallback(
    (data: T[], more: boolean = true) => {
      setItems(data);
      pageRef.current = getNextPage(data.length, limit, totalRecords);
      setHasMore(more && data.length < totalRecords);
    },
    [limit, totalRecords]
  );

  useEffect(() => {
    // If all records are loaded, don't observe
    if (!hasMore || !loaderRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      {
        root,
        rootMargin: eagerLoad ? `${parseInt(rootMargin) + 300}px` : rootMargin,
        threshold,
      }
    );

    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [hasMore, loadMore, root, rootMargin, threshold, eagerLoad]);

  return {
    items,
    loading,
    error,
    hasMore,
    loaderRef,
    loadMore,
    setExternalData,
  };
}
