import React from 'react';
import { cn } from '../utils/helpers';

const Table = ({ headers, children, isLoading, isEmpty, emptyMessage, className }) => {
  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50/50 text-slate-400 text-[10px] uppercase tracking-[0.1em] font-bold">
            {headers.map((header, index) => (
              <th key={index} className={cn("px-6 py-4", header.className)}>
                {header.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} className="animate-pulse">
                {headers.map((_, j) => (
                  <td key={j} className="px-6 py-4">
                    <div className="h-10 bg-slate-100 rounded-lg w-full"></div>
                  </td>
                ))}
              </tr>
            ))
          ) : isEmpty ? (
            <tr>
              <td colSpan={headers.length} className="px-6 py-12 text-center text-slate-500 font-medium italic">
                {emptyMessage || 'No data found.'}
              </td>
            </tr>
          ) : (
            children
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
