import React from 'react';
import { Search, Plus, Calendar, ChevronLeft, ChevronRight, UserCheck, UserX, Loader2, CheckCircle2 } from 'lucide-react';
import { cn } from '../../utils/helpers';

import Table from '../../components/Table';
import Pagination from '../../components/Pagination';

const AttendanceList = ({ 
  search, 
  setSearch, 
  setPage, 
  setIsModalOpen, 
  currentDate, 
  setCurrentDate, 
  members, 
  membersLoading, 
  pagination, 
  page, 
  daysInMonth, 
  attendanceMap, 
  handleCheckIn, 
  isCheckingIn, 
  isMarkingAbsent 
}) => {
  const isToday = (day) => {
    const today = new Date();
    return today.getDate() === day && 
           today.getMonth() === currentDate.getMonth() && 
           today.getFullYear() === currentDate.getFullYear();
  };

  const tableHeaders = [
    { label: 'Member Name', className: 'sticky left-0 bg-slate-50/50 z-10 border-r border-slate-100' },
    ...daysInMonth.map(day => ({
      label: day.toString(),
      className: cn(
        "text-center min-w-[40px] border-r border-slate-100 last:border-r-0",
        isToday(day) && "text-indigo-600 font-black bg-indigo-50/30"
      )
    })),
    { label: 'Action', className: 'text-center sticky right-0 bg-slate-50/50 z-10 border-l border-slate-100' }
  ];

  const handlePrevMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDate(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  return (
    <div className="space-y-6 flex flex-col flex-1">
      {/* Filters & Actions */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search member..."
              className="block w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-50/50 focus:border-indigo-500 text-sm outline-none transition-all shadow-sm"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>

          <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-wider">
            <div className="flex items-center gap-1.5 text-emerald-600">
              <div className="h-3 w-3 bg-emerald-500 rounded-sm"></div> Present
            </div>
            <div className="flex items-center gap-1.5 text-rose-600">
              <div className="h-3 w-3 bg-rose-500 rounded-sm"></div> Absent
            </div>
            <div className="flex items-center gap-1.5 text-slate-300">
              <div className="h-3 w-3 bg-slate-100 border border-slate-200 rounded-sm"></div> Not Marked
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-50 border border-slate-200 rounded-2xl p-1 shadow-sm">
            <button
              onClick={handlePrevMonth}
              className="p-2 hover:bg-white hover:shadow-sm rounded-xl transition-all text-slate-500"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="px-4 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-indigo-600" />
              <span className="text-sm font-bold text-slate-700">
                {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </span>
            </div>
            <button
              onClick={handleNextMonth}
              className="p-2 hover:bg-white hover:shadow-sm rounded-xl transition-all text-slate-500"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-4 py-2 text-sm font-bold text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
          >
            Today
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col flex-1">
        <Table
          headers={tableHeaders}
          isLoading={membersLoading}
          isEmpty={members.length === 0}
          emptyMessage="No members found."
          className="min-w-[1200px]"
        >
          {members.map((member) => (
            <tr key={member.id} className="hover:bg-slate-50/50 transition-colors group">
              <td className="px-6 py-4 font-bold text-slate-900 sticky left-0 bg-white group-hover:bg-slate-50 transition-colors z-10 border-r border-slate-100 shadow-[2px_0_5px_rgba(0,0,0,0.01)]">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 group-hover:text-indigo-600 group-hover:bg-indigo-50 transition-all">
                    <UserCheck className="h-4 w-4" />
                  </div>
                  <span className="text-sm truncate max-w-[150px]">{member.fullName}</span>
                </div>
              </td>
              {daysInMonth.map(day => {
                const status = attendanceMap[`${member.id}_${day}`];
                return (
                  <td key={day} className={cn(
                    "px-1 py-4 border-r border-slate-100 last:border-r-0 text-center",
                    isToday(day) && "bg-indigo-50/10"
                  )}>
                    <div className={cn(
                      "h-5 w-5 mx-auto rounded-md flex items-center justify-center transition-all",
                      status === 'present' 
                        ? "bg-emerald-500 shadow-sm shadow-emerald-200" 
                        : status === 'absent'
                          ? "bg-rose-500 shadow-sm shadow-rose-200"
                          : "bg-slate-100 border border-slate-200/50"
                    )}>
                      {status === 'present' && <CheckCircle2 className="h-3 w-3 text-white" />}
                      {status === 'absent' && <UserX className="h-3 w-3 text-white" />}
                    </div>
                  </td>
                );
              })}
              <td className="px-4 py-4 sticky right-0 bg-white group-hover:bg-slate-50 transition-colors z-10 border-l border-slate-100 shadow-[-2px_0_5px_rgba(0,0,0,0.01)]">
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => handleCheckIn(member.id, 'present')}
                    disabled={isCheckingIn || isMarkingAbsent}
                    className={cn(
                      "h-8 w-8 flex items-center justify-center rounded-lg transition-all shadow-sm",
                      isToday(new Date().getDate()) && attendanceMap[`${member.id}_${new Date().getDate()}`] === 'present'
                        ? "bg-emerald-500 text-white"
                        : "bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white"
                    )}
                    title="Mark Present"
                  >
                    {isCheckingIn ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserCheck className="h-4 w-4" />}
                  </button>
                  
                  <button
                    onClick={() => handleCheckIn(member.id, 'absent')}
                    disabled={isCheckingIn || isMarkingAbsent}
                    className={cn(
                      "h-8 w-8 flex items-center justify-center rounded-lg transition-all shadow-sm",
                      isToday(new Date().getDate()) && attendanceMap[`${member.id}_${new Date().getDate()}`] === 'absent'
                        ? "bg-rose-500 text-white"
                        : "bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white"
                    )}
                    title="Mark Absent"
                  >
                    {isCheckingIn ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserX className="h-4 w-4" />}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </Table>
      </div>

      {/* Pagination */}
      <Pagination
        page={page}
        totalPages={pagination.totalPages}
        totalData={pagination.totalData}
        currentItemsCount={members.length}
        onPageChange={setPage}
      />
    </div>
  );
};

export default AttendanceList;
