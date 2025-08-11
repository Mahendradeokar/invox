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
}

export function useInfiniteScroll<T>({
  fetchFn,
  initialData = [],
  limit = 10,
  eagerLoad = false,
  root = null,
  rootMargin = "200px",
  threshold = 0,
}: UseInfiniteScrollOptions<T>) {
  const [items, setItems] = useState<T[]>(initialData);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<unknown>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const getNextPage = (currentItemsLength: number, limit: number) => {
    if (currentItemsLength === 0) return 1;
    return Math.floor(currentItemsLength / limit) + 1;
  };

  const pageRef = useRef<number>(getNextPage(initialData.length, limit));
  console.log(pageRef.current, limit, initialData);
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
      setItems((prev) => [...prev, ...newItems]);
      pageRef.current = getNextPage(items.length + newItems.length, limit);
      setHasMore(more);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [limit, loading, hasMore, items.length]);

  const setExternalData = useCallback(
    (data: T[], more: boolean = true) => {
      setItems(data);
      pageRef.current = getNextPage(data.length, limit);
      setHasMore(more);
    },
    [limit]
  );

  useEffect(() => {
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
