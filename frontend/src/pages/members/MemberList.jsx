import React from 'react';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  User,
  CreditCard
} from 'lucide-react';
import { formatDate, cn } from '../../utils/helpers';
import Table from '../../components/Table';
import Pagination from '../../components/Pagination';

const MemberList = ({ 
  members, 
  pagination, 
  page, 
  setPage, 
  search, 
  setSearch, 
  isLoading, 
  onEdit, 
  onDelete, 
  onAssignPlan, 
  onAddNew 
}) => {
  const tableHeaders = [
    { label: 'Member' },
    { label: 'Contact' },
    { label: 'Joined Date' },
    { label: 'Actions', className: 'text-right' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Members</h1>
          <p className="text-slate-500 mt-1 font-medium">Manage your gym members and their details.</p>
        </div>
        <button 
          onClick={onAddNew}
          className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
        >
          <Plus className="h-5 w-5" />
          Add Member
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Filters */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
          <div className="relative max-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, email or phone..."
              className="block w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-50/50 focus:border-indigo-500 text-sm outline-none transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        <Table
          headers={tableHeaders}
          isLoading={isLoading}
          isEmpty={members.length === 0}
          emptyMessage="No members found."
        >
          {members.map((member) => (
            <tr key={member.id} className="divide-x divide-slate-100 transition-colors group">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 border border-indigo-100">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 leading-none mb-1">{member.fullName}</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{member.gender || 'N/A'} • {member.age || 'N/A'} yrs</p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <p className="text-sm font-bold text-slate-700">{member.email}</p>
                <p className="text-xs text-slate-500 font-medium mt-0.5">{member.phone}</p>
              </td>
              <td className="px-6 py-4">
                <p className="text-sm text-slate-600 font-bold">{formatDate(member.createdAt)}</p>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center justify-end gap-2 transition-opacity">
                  {(() => {
                    const isActive = member.subscriptionStatus === 'active';
                    return (
                      <div className="relative group/btn">
                        <button 
                          onClick={() => !isActive && onAssignPlan(member)}
                          disabled={isActive}
                          title={isActive ? `Plan active until ${formatDate(member.latestEndDate)}` : "Assign Plan"}
                          className={cn(
                            "p-2 rounded-lg transition-all",
                            isActive 
                              ? "text-slate-300 cursor-not-allowed" 
                              : "text-slate-400 hover:text-emerald-600 hover:bg-emerald-50"
                          )}
                        >
                          <CreditCard className="h-4 w-4" />
                        </button>
                        
                        {isActive && (
                          <div className="absolute bottom-full right-0 mb-2 hidden group-hover/btn:block w-48 bg-slate-900 text-white text-[10px] p-2 rounded-lg shadow-xl z-50">
                            Plan is active until {formatDate(member.latestEndDate)}.
                            <div className="absolute top-full right-4 border-8 border-transparent border-t-slate-900"></div>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                  <button 
                    onClick={() => onEdit(member)}
                    className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => onDelete(member)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </Table>

        {/* Pagination */}
        <Pagination
          page={page}
          totalPages={pagination.totalPages}
          totalData={pagination.totalData}
          currentItemsCount={members.length}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
};

export default MemberList;
