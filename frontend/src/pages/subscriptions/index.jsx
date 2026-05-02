import React, { useState, useEffect } from 'react';
import { useGetMembersByStatusQuery } from '../../redux/api/subscriptionApi';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';
import {
  Search,
  UserCheck,
  UserX,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  User,
  Filter
} from 'lucide-react';
import { cn, formatDate } from '../../utils/helpers';
import PlanModal from '../../components/PlanModal';
import Table from '../../components/Table';
import Pagination from '../../components/Pagination';

const Subscriptions = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search, 500);
  const [status, setStatus] = useState('active');
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const { data, isLoading, isFetching } = useGetMembersByStatusQuery({ 
    page, 
    search: debouncedSearch,
    status,
    limit: 10 
  });
  
  const members = data?.data?.items || [];
  const pagination = data?.data || {};

  const handleAssignPlan = (member) => {
    setSelectedMember(member);
    setIsPlanModalOpen(true);
  };

  const tableHeaders = [
    { label: 'Member' },
    { label: 'Current Plan' },
    { label: 'Start Date' },
    { label: 'End Date' },
    { label: 'Actions', className: 'text-right' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Subscriptions</h1>
          <p className="text-slate-500 mt-1 font-medium">Monitor active and expired member plans.</p>
        </div>
        <div className="flex bg-white p-1 rounded-2xl border border-slate-200 shadow-sm">
          <button
            onClick={() => { setStatus('active'); setPage(1); }}
            className={cn(
              "px-6 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2",
              status === 'active' ? "bg-emerald-600 text-white shadow-lg shadow-emerald-100" : "text-slate-500 hover:bg-slate-50"
            )}
          >
            <UserCheck className="h-4 w-4" />
            Active
          </button>
          <button
            onClick={() => { setStatus('expired'); setPage(1); }}
            className={cn(
              "px-6 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2",
              status === 'expired' ? "bg-rose-600 text-white shadow-lg shadow-rose-100" : "text-slate-500 hover:bg-slate-50"
            )}
          >
            <UserX className="h-4 w-4" />
            Expired
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Filters */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder={`Search ${status} members...`}
              className="block w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-50/50 focus:border-indigo-500 text-sm outline-none transition-all shadow-sm"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
        </div>

        {/* Table */}
        <Table
          headers={tableHeaders}
          isLoading={isLoading || isFetching}
          isEmpty={members.length === 0}
          emptyMessage={`No ${status} members found.`}
        >
          {members.map((member) => (
            <tr key={member.id} className="divide-x divide-slate-100 transition-colors">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "h-10 w-10 rounded-full flex items-center justify-center border",
                    status === 'active' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-rose-50 text-rose-600 border-rose-100"
                  )}>
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 leading-none mb-1">{member.fullName}</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{member.phone}</p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-slate-400" />
                  <p className="text-sm font-bold text-slate-700">{member.planName || 'N/A'}</p>
                </div>
              </td>
              <td className="px-6 py-4">
                <p className="text-sm font-bold text-slate-700">
                  {formatDate(member.latestStartDate)}
                </p>
              </td>
              <td className="px-6 py-4">
                <p className={cn(
                  "text-sm font-bold",
                  status === 'active' ? "text-emerald-600" : "text-rose-600"
                )}>
                  {formatDate(member.latestEndDate)}
                </p>
              </td>
              <td className="px-6 py-4 text-right">
                {(() => {
                  const isActive = status === 'active';
                  return (
                    <div className="relative group/btn inline-block">
                      <button
                        onClick={() => !isActive && handleAssignPlan(member)}
                        disabled={isActive}
                        title={isActive ? `Plan is active until ${formatDate(member.latestEndDate)}` : 'Assign Plan'}
                        className={cn(
                          "inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm",
                          isActive
                            ? "bg-slate-100 text-slate-400 cursor-not-allowed opacity-60"
                            : "bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white"
                        )}
                      >
                        <CreditCard className="h-3.5 w-3.5" />
                        {isActive ? 'Renew Plan' : 'Assign Plan'}
                      </button>

                      {isActive && (
                        <div className="absolute bottom-full right-0 mb-2 hidden group-hover/btn:block w-48 bg-slate-900 text-white text-[10px] p-2 rounded-lg shadow-xl z-50">
                          Plan is active until {formatDate(member.latestEndDate)}. Renewal available after this date.
                          <div className="absolute top-full right-4 border-8 border-transparent border-t-slate-900"></div>
                        </div>
                      )}
                    </div>
                  );
                })()}
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

      {/* Plan Assignment Modal */}
      <PlanModal
        isOpen={isPlanModalOpen}
        onClose={() => setIsPlanModalOpen(false)}
        memberId={selectedMember?.id}
        memberName={selectedMember?.fullName}
        currentEndDate={selectedMember?.latestEndDate}
        isRenewal={status === 'active'}
      />
    </div>
  );
};

export default Subscriptions;
