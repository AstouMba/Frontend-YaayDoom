import { useEffect, useMemo, useState } from 'react';

export function usePagination<T>(items: T[], itemsPerPage = 10) {
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [items.length, itemsPerPage]);

  const totalPages = Math.max(1, Math.ceil(items.length / itemsPerPage));

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const paginatedItems = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return items.slice(start, start + itemsPerPage);
  }, [items, itemsPerPage, page]);

  const start = items.length === 0 ? 0 : (page - 1) * itemsPerPage + 1;
  const end = Math.min(page * itemsPerPage, items.length);

  return {
    page,
    setPage,
    totalPages,
    paginatedItems,
    start,
    end,
  };
}

export default usePagination;
