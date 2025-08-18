import { ReactNode, ElementType, ComponentPropsWithoutRef } from "react";
import { useInfiniteScroll } from "~/hooks/use-infinite-scroll";
import { Loading } from "./loading";

type FetchFn<T> = (
  page: number,
  limit: number
) => Promise<{ items: T[]; hasMore: boolean }>;

type RenderItemFn<T> = (item: T, idx: number) => ReactNode;
type RenderLoaderFn = () => ReactNode;
type RenderErrorFn = (error: unknown, retry: () => void) => ReactNode;
type RenderEndFn = () => ReactNode;

export type InfiniteScrollListProps<T, As extends ElementType = "div"> = Omit<
  ComponentPropsWithoutRef<As>,
  "children"
> & {
  fetchFn: FetchFn<T>;
  initialData?: T[];
  limit?: number;
  totalRecords: number;
  eagerLoad?: boolean;
  renderItem: RenderItemFn<T>;
  renderLoader?: RenderLoaderFn;
  renderError?: RenderErrorFn;
  renderEnd?: RenderEndFn;
  as?: As;
  className?: string;
};

export default function InfiniteScrollList<T, As extends ElementType = "div">({
  fetchFn,
  initialData = [],
  limit = 10,
  totalRecords,
  eagerLoad = false,
  renderItem,
  renderLoader = () => <InfiniteScrollLoader />,
  renderError = (error, retry) => (
    <InfiniteScrollError error={error} retry={retry} />
  ),
  renderEnd = () => <InfiniteScrollEnd />,
  as,
  className,
  ...rest
}: InfiniteScrollListProps<T, As>) {
  const { items, loading, error, hasMore, loaderRef, loadMore } =
    useInfiniteScroll<T>({
      fetchFn,
      initialData,
      limit,
      eagerLoad,
      totalRecords,
    });

  const Component = as || "div";

  return (
    <>
      <Component className={className} {...rest}>
        {items.map((item, idx) => renderItem(item, idx))}
      </Component>
      {loading && renderLoader()}
      {Boolean(error) && renderError(error, loadMore)}
      {hasMore && <div ref={loaderRef} style={{ height: 1 }} />}
      {!hasMore && !loading && renderEnd()}
    </>
  );
}

export function InfiniteScrollLoader() {
  return <Loading className="min-h-12" />;
}

export function InfiniteScrollError({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  return (
    <div className="flex gap-2 items-center bg-destructive/10 rounded-md p-4 text-destructive text-center">
      <div className="mb-2">
        {error instanceof Error ? error.message : String(error)}
      </div>
      <button
        onClick={retry}
        className="px-4 py-2 bg-destructive text-white rounded hover:bg-destructive/90 transition"
      >
        Retry
      </button>
    </div>
  );
}

export function InfiniteScrollEnd() {
  return (
    <div className="flex items-center justify-center min-h-12 text-muted-foreground text-center">
      No more items to fetch
    </div>
  );
}
