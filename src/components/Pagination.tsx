interface PaginationProps {
  page: number;
  totalPages: number;
  start: number;
  end: number;
  total: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  page,
  totalPages,
  start,
  end,
  total,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-5">
      <p className="text-sm text-gray-500">
        Affichage de {start} à {end} sur {total}
      </p>
      <div className="flex items-center gap-1.5 flex-wrap">
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1}
          className="px-3 py-1.5 rounded-lg text-sm font-medium border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <i className="ri-arrow-left-line"></i>
        </button>
        {pages.map((p) => (
          <button
            type="button"
            key={p}
            onClick={() => onPageChange(p)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
              page === p ? 'text-white border-transparent' : 'border-gray-200 hover:bg-gray-50 text-gray-600'
            }`}
            style={page === p ? { backgroundColor: 'var(--primary-teal)' } : undefined}
          >
            {p}
          </button>
        ))}
        <button
          type="button"
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className="px-3 py-1.5 rounded-lg text-sm font-medium border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <i className="ri-arrow-right-line"></i>
        </button>
      </div>
    </div>
  );
}
