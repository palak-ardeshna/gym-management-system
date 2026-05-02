import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ page, totalPages, totalData, currentItemsCount, onPageChange }) => {
  if (!totalData || totalData === 0) return null;

  return (
    <div className="bg-white px-6 py-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between mt-4">
      <p className="text-sm text-slate-500 font-medium">
        Showing <span className="text-slate-900 font-bold">{currentItemsCount}</span> of <span className="text-slate-900 font-bold">{totalData}</span> items
      </p>
      <div className="flex items-center gap-2">
        <button
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
          className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-50 transition-colors shadow-sm"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="text-sm font-bold px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl">
          {page}
        </span>
        <button
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-50 transition-colors shadow-sm"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
